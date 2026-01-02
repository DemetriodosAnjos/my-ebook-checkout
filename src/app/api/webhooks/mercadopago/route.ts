import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { config } from "@/lib/config";

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

    const payment = await paymentClient.get({ id: data.id });
    const status = payment.status;
    const externalReference = payment.external_reference;
    // Lendo o metadata que configuramos no checkoutBack
    const isSimulation =
      payment.metadata?.is_simulation === true ||
      payment.metadata?.is_simulation === "true";

    if (!externalReference || !supabaseAdmin) {
      return NextResponse.json(
        { message: "Dados insuficientes" },
        { status: 200 }
      );
    }

    // 1. Lógica de Expiração para o Voucher (20 minutos)
    const voucherExpiresAt = new Date();
    voucherExpiresAt.setMinutes(voucherExpiresAt.getMinutes() + 20);

    // 2. ATUALIZAÇÃO NO SUPABASE
    const { data: saleData, error: dbError } = await supabaseAdmin
      .from("sales")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
        // Só salvamos a expiração se for um teste aprovado
        ...(isSimulation && status === "approved"
          ? { voucher_expires_at: voucherExpiresAt.toISOString() }
          : {}),
      })
      .eq("external_reference", externalReference)
      .select("email, name, plan_type")
      .single();

    if (dbError) console.error("❌ [ERRO DB]:", dbError.message);

    const buyerEmail = saleData?.email || payment.payer?.email;

    // 3. FLUXO DE DISPARO CONDICIONAL
    if (status === "approved" && buyerEmail) {
      if (isSimulation) {
        // --- ENVIO DO VOUCHER (O "GANCHO") ---
        const resgateLink = `${config.siteUrl}/resgate/${externalReference}`;

        await transporter.sendMail({
          from: `"Suporte Developer" <${process.env.SMTP_USER}>`,
          to: buyerEmail,
          subject: "⚡️ Webhook Validado! (Seu Voucher expirará em 20 min)",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #10b981; padding: 20px; border-radius: 10px;">
              <h2 style="color: #10b981;">Viu como é rápido? 🚀</h2>
              <p>O pagamento de R$ 0,99 foi processado e este e-mail foi disparado <strong>instantaneamente</strong> pelo nosso Webhook.</p>
              <p>Como prometido, seu voucher de <strong>R$ 99,00 OFF</strong> foi ativado, mas ele tem prazo de validade.</p>
              <div style="margin: 30px 0; text-align: center; background: #f0fdf4; padding: 20px; border-radius: 8px;">
                <p style="margin-bottom: 10px; font-weight: bold;">Seu tempo está correndo:</p>
                <a href="${resgateLink}" style="background: #10b981; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">RESGATAR MEU DESCONTO AGORA</a>
              </div>
              <p style="font-size: 12px; color: #666; text-align: center;">Após 20 minutos, este link expirará e o valor voltará ao preço original.</p>
            </div>
          `,
        });
      } else {
        // --- ENVIO DO PRODUTO REAL ---
        const driveLink =
          "https://drive.google.com/file/d/1YTgGJKucsA6uZfu7OhcvdKewueS7z0Ce/view?usp=sharing";
        const repoLink = "https://github.com/DemetriodosAnjos/boilerplate";

        await transporter.sendMail({
          from: `"Suporte Developer" <${process.env.SMTP_USER}>`,
          to: buyerEmail,
          subject: "Seu acesso ao material foi liberado 🎉",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
              <h2 style="color: #10b981;">Parabéns, ${
                saleData?.name || "Dev"
              }!</h2>
              <p>Seu acesso ao <strong>Boilerplate</strong> já está disponível:</p>
              <div style="margin: 20px 0;">
                <a href="${repoLink}" style="background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">Acessar Github</a>
                <a href="${driveLink}" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Baixar Instruções</a>
              </div>
            </div>
          `,
        });
      }
      console.log(
        `✅ Fluxo ${
          isSimulation ? "SIMULAÇÃO" : "REAL"
        } finalizado para: ${buyerEmail}`
      );
    }

    return NextResponse.json({ status: "processed" }, { status: 200 });
  } catch (error: unknown) {
    console.error(
      "🔥 [Webhook Error]:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
