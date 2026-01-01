"use server";

import { v4 as uuidv4 } from "uuid";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { config } from "@/lib/config";
import { redirect } from "next/navigation";

const client = new MercadoPagoConfig({
  accessToken: config.mercadopago.accessToken,
});
const preferenceClient = new Preference(client);

const PLAN_PRICES: Record<string, number> = {
  anual: 197.0,
  vitalicio: 497.0,
};

interface UserData {
  name: string;
  email: string;
  phone: string;
}

export async function handlePurchase(planId: string, userData: UserData) {
  const amount = PLAN_PRICES[planId];
  if (!amount) throw new Error("Plano inválido.");

  const { name, email, phone } = userData;
  const external_reference = uuidv4();
  let checkoutUrl: string | undefined;

  const finalEmail =
    email.startsWith("TESTUSER") && !email.includes("@")
      ? `${email}@testuser.com`
      : email;

  try {
    // Validação de Segurança para o TypeScript
    if (!supabaseAdmin) {
      throw new Error("Erro de configuração: Supabase Admin não inicializado.");
    }

    // 1. Registro Inicial (Sempre como PENDING)
    const { error: supabaseError } = await supabaseAdmin.from("sales").insert([
      {
        name,
        email: finalEmail,
        phone,
        status: "pending",
        external_reference,
        amount,
        plan_type: planId,
        payment_method: "pix",
      },
    ]);

    if (supabaseError) throw new Error(`Supabase: ${supabaseError.message}`);

    // 2. Criação da Preferência no Mercado Pago
    const result = await preferenceClient.create({
      body: {
        items: [
          {
            id: planId,
            title: `Acesso ${planId.toUpperCase()}`,
            quantity: 1,
            unit_price: amount,
            currency_id: "BRL",
          },
        ],
        external_reference,
        payer: {
          email: finalEmail,
          name,
          phone: { number: phone.replace(/\D/g, "") },
        },
        back_urls: {
          success: `${config.siteUrl}/success`,
          failure: `${config.siteUrl}/failure`,
        },
        auto_return: "approved",
      },
    });

    checkoutUrl = result.init_point;
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
    console.error("🔥 Erro no Checkout:", err);
    return { error: "Falha ao iniciar pagamento. Tente novamente." };
  }

  if (checkoutUrl) redirect(checkoutUrl);
}
