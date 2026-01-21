import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getSupabaseAdmin } from "../../../../lib/supabaseClient";
import { config } from "../../../../lib/config";

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

    // Garantir Supabase Admin inicializado
    const admin = getSupabaseAdmin();

    // Criar referência única
    const external_reference = `ebook_supreme_${Date.now()}`;

    // Registrar venda no Supabase
    await admin.from("sales").insert({
      email,
      name,
      plan: "supreme",
      external_reference,
      status: "pending",
    });

    // Criar preferência no Mercado Pago
    const preferenceClient = new Preference(mpClient);

    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: "ebook_supreme",
            title: "Pacote Supremo (Ebook + Vendas + 200pg + 80 aulas)",
            quantity: 1,
            unit_price: 99.9,
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
    console.error("Erro no checkout SUPREME:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
