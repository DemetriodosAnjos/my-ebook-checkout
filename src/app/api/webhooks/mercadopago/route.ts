import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { config } from "@/lib/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type !== "payment" || !data?.id) {
      return NextResponse.json({ message: "Evento ignorado" }, { status: 200 });
    }

    const client = new MercadoPagoConfig({
      accessToken: config.mercadopago.accessToken,
    });
    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: data.id });

    const status = payment.status;
    const externalReference = payment.external_reference;
    const amount = payment.transaction_amount || 0;

    // Diferenciação robusta entre validação (R$ 0,99) e venda real
    const isSimulation = amount < 2.0;

    if (!externalReference || !supabaseAdmin) {
      return NextResponse.json(
        { message: "Dados insuficientes" },
        { status: 200 }
      );
    }

    const expiresDate = new Date();
    expiresDate.setMinutes(expiresDate.getMinutes() + 20);

    // Persistência com lógica de "Queima" de voucher
    const { data: saleData, error: dbError } = await supabaseAdmin
      .from("sales")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
        // Se for simulação: gera data de expiração.
        // Se for venda real aprovada: marca o voucher como USADO.
        ...(isSimulation
          ? { voucher_expires_at: expiresDate.toISOString() }
          : status === "approved"
          ? { voucher_used: true }
          : {}),
      })
      .eq("external_reference", externalReference)
      .select("email, name")
      .single();

    if (dbError) console.error("❌ [ERRO DB]:", dbError.message);

    const buyerEmail = saleData?.email || payment.payer?.email;

    if (status === "approved" && buyerEmail) {
      if (isSimulation) {
        const resgateLink = `${config.siteUrl}/resgate/${externalReference}`;

        await transporter.sendMail({
          from: `"Suporte Developer" <${process.env.SMTP_USER}>`,
          to: buyerEmail,
          subject: "⚡️ Webhook Validado! (Seu Voucher expira em 20 min)",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; border: 2px solid #10b981; padding: 20px; border-radius: 12px;">
              <h2 style="color: #10b981;">Pagamento de R$ ${amount.toFixed(
                2
              )} validado!</h2>
              <p>O sistema identificou sua validação. Agora você tem <strong>20 minutos</strong> para usar seu bônus de R$ 99,00 OFF.</p>
              <div style="margin: 30px 0; text-align: center;">
                <a href="${resgateLink}" style="background: #10b981; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 14px 0 rgba(16,185,129,0.39);">RESGATAR MEU DESCONTO</a>
              </div>
              <p style="font-size: 12px; color: #999; text-align: center;">Após este período, o link de resgate será invalidado automaticamente.</p>
            </div>
          `,
        });
      } else {
        await transporter.sendMail({
          from: `"Suporte Developer" <${process.env.SMTP_USER}>`,
          to: buyerEmail,
          subject: "Seu acesso ao material foi liberado 🎉",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
              <h2 style="color: #10b981;">Acesso Confirmado!</h2>
              <p>Obrigado por adquirir o material completo. Seu voucher de desconto foi utilizado com sucesso.</p>
              <div style="margin: 20px 0;">
                <a href="https://github.com/..." style="background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Repositório</a>
              </div>
            </div>
          `,
        });
      }
    }

    return NextResponse.json({ status: "processed" }, { status: 200 });
  } catch (error: unknown) {
    console.error("🔥 [Webhook Error]:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
