import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { config } from "@/lib/config";

// Instâncias fora do POST para reutilização em ambiente serverless
const mpClient = new MercadoPagoConfig({
  accessToken: config.mercadopago.accessToken,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function POST(request: Request) {
  try {
    // 1. SECURITY GATE: Validação via Query Param
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (!secret || secret !== process.env.WEBHOOK_SECRET) {
      console.warn("⚠️ [Webhook] Tentativa de acesso sem secret válido.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    // Ignora eventos que não sejam de pagamento
    if (type !== "payment" || !data?.id) {
      return NextResponse.json({ message: "Evento ignorado" }, { status: 200 });
    }

    // 2. BUSCA DE PAGAMENTO
    const paymentClient = new Payment(mpClient);
    const payment = await paymentClient.get({ id: data.id });

    const { status, external_reference, transaction_amount: amount } = payment;

    if (!external_reference || !supabaseAdmin) {
      return NextResponse.json(
        { message: "Dados insuficientes" },
        { status: 200 }
      );
    }

    // 3. LÓGICA DE NEGÓCIO: Simulação vs Venda Real
    const isSimulation = (amount || 0) < 2.0;
    const expiresDate = new Date();
    expiresDate.setMinutes(expiresDate.getMinutes() + 20);

    // 4. ATUALIZAÇÃO NO BANCO
    const { data: saleData, error: dbError } = await supabaseAdmin
      .from("sales")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
        ...(isSimulation
          ? { voucher_expires_at: expiresDate.toISOString() }
          : status === "approved"
          ? { voucher_used: true }
          : {}),
      })
      .eq("external_reference", external_reference)
      .select("email, name")
      .single();

    if (dbError) {
      console.error("❌ [DB ERROR]:", dbError.message);
      // Retornamos 200 mesmo com erro de DB para o MP parar de tentar enviar o mesmo webhook
      return NextResponse.json(
        { message: "Erro ao atualizar banco" },
        { status: 200 }
      );
    }

    const buyerEmail = saleData?.email || payment.payer?.email;

    // 5. DISPARO DE E-MAILS (Somente se aprovado)
    if (status === "approved" && buyerEmail) {
      const emailContent = isSimulation
        ? getSimulationEmail(
            `${config.siteUrl}/resgate/${external_reference}`,
            amount || 0
          )
        : getSuccessEmail();

      await transporter.sendMail({
        from: `"Suporte Developer" <${process.env.SMTP_USER}>`,
        to: buyerEmail,
        subject: isSimulation
          ? "⚡️ Webhook Validado! (Bônus de R$ 99,00)"
          : "Seu acesso foi liberado 🎉",
        html: emailContent,
      });
    }

    return NextResponse.json({ status: "processed" }, { status: 200 });
  } catch (error: any) {
    console.error("🔥 [Webhook Error]:", error?.message || error);
    // Retornamos 500 para o MP tentar novamente em caso de erro de infra (ex: timeout)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// Helpers para limpar o código principal
function getSimulationEmail(link: string, amount: number) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; border: 2px solid #10b981; padding: 20px; border-radius: 12px;">
      <h2 style="color: #10b981;">Pagamento de R$ ${amount.toFixed(
        2
      )} validado!</h2>
      <p>O sistema identificou sua validação. Agora você tem <strong>20 minutos</strong> para usar seu bônus de R$ 99,00 OFF.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${link}" style="background: #10b981; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">RESGATAR MEU DESCONTO</a>
      </div>
      <p style="font-size: 12px; color: #999; text-align: center;">Voucher de uso único e temporário.</p>
    </div>`;
}

function getSuccessEmail() {
  return `
    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #10b981;">Acesso Confirmado!</h2>
      <p>Seu voucher de desconto foi utilizado com sucesso e seu acesso está liberado.</p>
      <div style="margin: 20px 0;">
        <a href="https://github.com/..." style="background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Repositório</a>
      </div>
    </div>`;
}
