import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabaseClient";

// 1. Configuração do Transporter (Reutilizável)
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

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    });
    const paymentClient = new Payment(client);

    // Consulta detalhes do pagamento no Mercado Pago
    const payment = await paymentClient.get({ id: data.id });
    const status = payment.status;
    const externalReference = payment.external_reference;

    // Tenta pegar e-mail do payer do MP ou do seu banco
    let buyerEmail = payment.payer?.email;

    // 2. Atualiza o status no Supabase
    if (externalReference) {
      const { data: saleData } = await supabaseAdmin
        .from("sales")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("external_reference", externalReference)
        .select("email")
        .single();

      // Se o MP não enviou o e-mail, usamos o que salvamos no banco no início do checkout
      if (!buyerEmail) buyerEmail = saleData?.email;
    }

    // 3. FLUXO DE APROVAÇÃO (Onde a mágica acontece)
    if (status === "approved" && buyerEmail) {
      console.log(`[Aprovado] Enviando acesso para: ${buyerEmail}`);

      await transporter.sendMail({
        from: `"Suporte Developer 5TB" <${process.env.SMTP_USER}>`,
        to: buyerEmail,
        subject: "Seu acesso ao material foi liberado 🎉",
        html: `
          <div style="font-family: sans-serif; max-width: 600px;">
            <h2>Pagamento Confirmado!</h2>
            <p>Seu acesso ao Boilerplate está liberado.</p>
            <p><a href="${process.env.DOWNLOAD_LINK}" 
                  style="background: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block;">
               Acessar Área de Membros
            </a></p>
          </div>
        `,
      });
    }

    return NextResponse.json({ status: "processed" }, { status: 200 });
  } catch (error: any) {
    console.error("[Webhook Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
