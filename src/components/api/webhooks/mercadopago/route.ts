import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabaseClient";

// 1. Configuração do Transporter com checagem de tipos
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

    // Ignora se não for evento de pagamento
    if (type !== "payment") {
      return NextResponse.json({ message: "Evento ignorado" }, { status: 200 });
    }

    // Validação de variáveis de ambiente obrigatórias
    const accessToken = process.env.MP_ACCESS_TOKEN; // Usando o padrão que definimos antes
    if (!accessToken) {
      throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado.");
    }

    const client = new MercadoPagoConfig({ accessToken });
    const paymentClient = new Payment(client);

    // Consulta detalhes do pagamento
    const payment = await paymentClient.get({ id: data.id });
    const status = payment.status;
    const externalReference = payment.external_reference;
    let buyerEmail = payment.payer?.email;

    // 2. Atualiza o status no Supabase (RESOLVENDO ERRO DE BUILD)
    if (externalReference) {
      // O Pulo do Gato: Type Guard para o TypeScript não reclamar de 'null'
      if (!supabaseAdmin) {
        console.error("❌ [WEBHOOK] SupabaseAdmin não inicializado.");
        return NextResponse.json(
          { error: "Database connection failed" },
          { status: 500 }
        );
      }

      const { data: saleData, error: dbError } = await supabaseAdmin
        .from("sales")
        .update({
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("external_reference", externalReference)
        .select("email")
        .single();

      if (dbError) {
        console.error("❌ [DATABASE ERROR]:", dbError.message);
      }

      // Se o MP não enviou o e-mail, usamos o do banco
      if (!buyerEmail && saleData) {
        buyerEmail = saleData.email;
      }
    }

    // 3. FLUXO DE APROVAÇÃO
    if (status === "approved" && buyerEmail) {
      console.log(`🚀 [APROVADO] Enviando acesso para: ${buyerEmail}`);

      await transporter.sendMail({
        from: `"Suporte Boilerplate" <${process.env.SMTP_USER}>`,
        to: buyerEmail,
        subject: "Seu acesso foi liberado 🎉",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #10b981;">Pagamento Confirmado!</h2>
            <p>Olá! Seu pagamento foi processado com sucesso e seu acesso já está disponível.</p>
            <div style="margin: 30px 0;">
              <a href="${process.env.DOWNLOAD_LINK}" 
                 style="background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                 Acessar Minha Área de Membros
              </a>
            </div>
            <p style="font-size: 12px; color: #666;">Se o botão não funcionar, copie este link: ${process.env.DOWNLOAD_LINK}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ status: "processed" }, { status: 200 });
  } catch (error) {
    // Tratamento de erro sem 'any'
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("🔥 [Webhook Error]:", errorMessage);

    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
