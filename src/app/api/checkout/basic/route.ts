import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getSupabaseAdmin } from "@/lib/supabaseClient";
import { config } from "@/lib/config";

const mpClient = new MercadoPagoConfig({
  accessToken: config.mercadopago.accessToken,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
    }

    // Garantir que o Supabase Admin existe
    const admin = getSupabaseAdmin();

    // 1. Criar registro no banco
    const external_reference = `ebook_basic_${Date.now()}`;

    await admin.from("sales").insert({
      email,
      name,
      plan: "basic",
      external_reference,
      status: "pending",
    });

    // 2. Criar preferência no Mercado Pago
    const preferenceClient = new Preference(mpClient);

    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: "ebook_basic",
            title: "Ebook Completo",
            quantity: 1,
            unit_price: 19.9,
          },
        ],
        payer: { email },
        external_reference,
        back_urls: {
          success: `${config.siteUrl}/sucesso`,
          failure: `${config.siteUrl}/erro`,
          pending: `${config.siteUrl}/pendente`,
        },
        auto_return: "approved",
        notification_url: `${config.siteUrl}/api/webhook?secret=${process.env.WEBHOOK_SECRET}`,
      },
    });

    return NextResponse.json({ init_point: preference.init_point });
  } catch (error: any) {
    console.error("Erro no checkout BASIC:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
