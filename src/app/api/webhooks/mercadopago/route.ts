import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { getSupabaseAdmin } from "@/lib/supabaseClient";
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

// ===============================
// LINKS DOS PLANOS
// ===============================
const LINKS = {
  basic: "https://drive.google.com/drive/folders/1R5689GoyaeA47au8cShaD8x9NU-Fndmc?usp=sharing",
  intermediate: "https://drive.google.com/drive/folders/1K_6O3FZgi86CBOCWYsh1qVaJ-aWgUIEN?usp=sharing",
  supreme: "https://drive.google.com/drive/folders/1irbeUXncNRT1wfO_LL8NWXsV11FQnf_T?usp=sharing",
};

export async function POST(request: Request) {
  try {
    // 1. SECURITY GATE
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (!secret || secret !== process.env.WEBHOOK_SECRET) {
      console.warn("⚠️ [Webhook] Tentativa de acesso sem secret válido.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    if (type !== "payment" || !data?.id) {
      return NextResponse.json({ message: "Evento ignorado" }, { status: 200 });
    }

    // 2. BUSCA DE PAGAMENTO
    const paymentClient = new Payment(mpClient);
    const payment = await paymentClient.get({ id: data.id });

    const { status, external_reference, transaction_amount: amount } = payment;

    if (!external_reference) {
      return NextResponse.json({ message: "Dados insuficientes" }, { status: 200 });
    }
    
    const admin = getSupabaseAdmin();
    

    // 3. SIMULAÇÃO
    const isSimulation = (amount || 0) < 2.0;
    const expiresDate = new Date();
    expiresDate.setMinutes(expiresDate.getMinutes() + 20);

    // 4. ATUALIZAÇÃO NO BANCO
    const { data: saleData, error: dbError } = await admin
      .from("sales")
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...(isSimulation
          ? { voucher_expires_at: expiresDate.toISOString() }
          : status === "approved"
          ? { voucher_used: true }
          : {}),
      })
      .eq("external_reference", external_reference)
      .select("email, name, plan")
      .single();

    if (dbError) {
      console.error("❌ [DB ERROR]:", dbError.message);
      return NextResponse.json({ message: "Erro ao atualizar banco" }, { status: 200 });
    }

    const buyerEmail = saleData?.email || payment.payer?.email;
    const plan = saleData?.plan;

    // 5. DISPARO DE E-MAILS
    if (status === "approved" && buyerEmail) {
      let emailContent;

      if (isSimulation) {
        emailContent = getSimulationEmail(
          `${config.siteUrl}/resgate/${external_reference}`,
          amount || 0
        );
      } else {
        emailContent = getPlanEmail(plan);
      }

      await transporter.sendMail({
        from: `"Suporte" <${process.env.SMTP_USER}>`,
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
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// ===============================
// EMAILS POR PLANO
// ===============================
function getPlanEmail(plan: string) {
  let link = "#";
  let title = "";
  let description = "";

  switch (plan) {
    case "basic":
      link = LINKS.basic;
      title = "Seu Ebook está liberado!";
      description = "Acesse agora o PDF completo com o método prático para gerar renda em até 7 dias.";
      break;

    case "intermediate":
      link = LINKS.intermediate;
      title = "Seu Pacote de Vendas está liberado!";
      description = "Acesse o Ebook + Apostila de Negociação e Vendas (70 páginas).";
      break;

    case "supreme":
      link = LINKS.supreme;
      title = "Seu Pacote Supremo está liberado!";
      description = "Acesse o Ebook + Apostila de Vendas + Apostila de Desenvolvimento Pessoal (200 páginas) + 80 videoaulas.";
      break;

    default:
      title = "Seu acesso está liberado!";
      description = "Clique no botão abaixo para acessar seu conteúdo.";
      break;
  }

  return `
    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #10b981;">${title}</h2>
      <p>${description}</p>

      <div style="margin: 30px 0; text-align: center;">
        <a href="${link}" target="_blank"
          style="background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          ACESSAR MATERIAL
        </a>
      </div>

      <p style="font-size: 12px; color: #777; text-align: center;">
        Qualquer dúvida, responda este e-mail.
      </p>
    </div>
  `;
}

// ===============================
// EMAIL DE SIMULAÇÃO (mantido)
// ===============================
function getSimulationEmail(link: string, amount: number) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; border: 2px solid #10b981; padding: 20px; border-radius: 12px;">
      <h2 style="color: #10b981;">Pagamento de R$ ${amount.toFixed(2)} validado!</h2>
      <p>O sistema identificou sua validação. Agora você tem <strong>20 minutos</strong> para usar seu bônus de R$ 99,00 OFF.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${link}" style="background: #10b981; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">RESGATAR MEU DESCONTO</a>
      </div>
      <p style="font-size: 12px; color: #999; text-align: center;">Voucher de uso único e temporário.</p>
    </div>`;
}
