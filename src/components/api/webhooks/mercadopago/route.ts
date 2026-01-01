import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { config } from "@/lib/config";

// 1. Configuração do Transporter (Nodemailer)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    console.log("📦 [WEBHOOK RECEBIDO]:", JSON.stringify(body, null, 2));

    // Ignora se não for evento de pagamento
    if (type !== "payment" || !data?.id) {
      return NextResponse.json(
        { message: "Evento não processável" },
        { status: 200 }
      );
    }

    const client = new MercadoPagoConfig({
      accessToken: config.mercadopago.accessToken,
    });
    const paymentClient = new Payment(client);

    // Consulta detalhes do pagamento no Mercado Pago
    const payment = await paymentClient.get({ id: data.id });
    const status = payment.status;
    const externalReference = payment.external_reference;
    let buyerEmail = payment.payer?.email;

    console.log(
      `🔍 [PAGAMENTO ${data.id}]: Status: ${status} | Ref: ${externalReference}`
    );

    if (!externalReference) {
      console.warn("⚠️ Webhook ignorado: external_reference ausente.");
      return NextResponse.json(
        { message: "Sem referência externa" },
        { status: 200 }
      );
    }

    if (!supabaseAdmin) {
      throw new Error("SupabaseAdmin não inicializado.");
    }

    // 2. ATUALIZAÇÃO NO SUPABASE
    // Buscamos o e-mail cadastrado na venda caso o MP não envie ou venha um e-mail de teste
    const { data: saleData, error: dbError } = await supabaseAdmin
      .from("sales")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("external_reference", externalReference)
      .select("email, name")
      .single();

    if (dbError) {
      console.error("❌ [ERRO DB]:", dbError.message);
    }

    // Prioriza o e-mail do nosso banco (garante que o acesso vá para quem preencheu o formulário)
    if (saleData?.email) {
      buyerEmail = saleData.email;
    }

    // 3. FLUXO DE APROVAÇÃO E ENVIO DE E-MAIL
    if (status === "approved" && buyerEmail) {
      console.log(`🚀 [LIBERANDO ACESSO]: ${buyerEmail}`);

      const driveLink =
        "https://drive.google.com/file/d/1YTgGJKucsA6uZfu7OhcvdKewueS7z0Ce/view?usp=sharing";
      const repoLink = "https://github.com/DemetriodosAnjos/boilerplate";

      await transporter.sendMail({
        from: `"Suporte Developer 5TB" <${process.env.SMTP_USER}>`,
        to: buyerEmail,
        subject: "Seu acesso ao material foi liberado 🎉",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #10b981;">Parabéns, ${
              saleData?.name || "seu"
            } pagamento foi aprovado!</h2>
            <p>Seu acesso ao <strong>Boilerplate</strong> e aos materiais complementares já está disponível nos links abaixo:</p>
            
            <div style="margin: 25px 0;">
              <p><strong>1. Repositório do Código:</strong></p>
              <a href="${repoLink}" style="background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Acessar Github</a>
            </div>

            <div style="margin: 25px 0;">
              <p><strong>2. Material Complementar (Drive):</strong></p>
              <a href="${driveLink}" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Baixar Instruções</a>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 14px; color: #666;">Obrigado pela confiança e bons estudos 🚀</p>
          </div>
        `,
      });

      console.log("✅ E-mail enviado com sucesso!");
    }

    return NextResponse.json({ status: "processed" }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("🔥 [Webhook Error]:", errorMessage);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
