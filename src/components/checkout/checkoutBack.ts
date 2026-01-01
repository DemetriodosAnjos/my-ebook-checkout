"use server";

import { v4 as uuidv4 } from "uuid";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { config } from "@/lib/config";
import { redirect } from "next/navigation";

// Configuração do Cliente Mercado Pago
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
  console.log("🚀 [CHECKOUT] Iniciando processo para o plano:", planId);

  const amount = PLAN_PRICES[planId];
  if (!amount) {
    console.error("❌ [ERRO] Preço não encontrado para o plano:", planId);
    throw new Error("Plano inválido.");
  }

  const { name, email, phone } = userData;
  const external_reference = uuidv4();
  let checkoutUrl: string | undefined;

  // Lógica para tratar e-mail de teste/sandbox
  // Se você digitar o ID de teste do MP no modal, ele completa o domínio
  const finalEmail =
    email.startsWith("TESTUSER") && !email.includes("@")
      ? `${email}@testuser.com`
      : email;

  try {
    // 1. Registro no Supabase
    console.log("📡 [SUPABASE] Inserindo venda...", {
      email: finalEmail,
      external_reference,
    });

    const { error: supabaseError } = await supabaseAdmin.from("sales").insert([
      {
        name,
        email: finalEmail,
        phone,
        status: "pending",
        external_reference,
        amount,
        payment_method: "pix",
        plan_type: planId,
      },
    ]);

    if (supabaseError) {
      console.error("❌ [SUPABASE ERRO]:", supabaseError.message);
      throw new Error(`Erro Supabase: ${supabaseError.message}`);
    }

    // 2. Criação da Preferência no Mercado Pago
    console.log("💳 [MERCADO PAGO] Gerando preferência para:", finalEmail);

    const result = await preferenceClient.create({
      body: {
        items: [
          {
            id: planId,
            title: `Acesso ${planId.toUpperCase()} - Boilerplate SaaS`,
            quantity: 1,
            unit_price: amount,
            currency_id: "BRL",
          },
        ],
        external_reference,
        payer: {
          email: finalEmail,
          name: userData.name,
          phone: {
            // Garante que enviamos apenas números, como o MP exige
            number: userData.phone.replace(/\D/g, ""),
          },
        },
        payment_methods: {
          excluded_payment_types: [{ id: "ticket" }], // Remove boleto
          installments: 12,
        },
        back_urls: {
          success: `${config.siteUrl}/success`,
          failure: `${config.siteUrl}/failure`,
          pending: `${config.siteUrl}/pending`,
        },
        auto_return: "approved",
      },
    });

    checkoutUrl = result.init_point;

    if (!checkoutUrl) throw new Error("Link de pagamento não gerado.");

    console.log("✅ [MERCADO PAGO] Preferência criada com sucesso!");
  } catch (err: unknown) {
    // Permite que o Next.js lide com o erro de redirecionamento interno
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }

    console.error("🔥 [FALHA NO CHECKOUT]:", err);

    return {
      error:
        "Não foi possível iniciar o checkout. Verifique se os dados de teste estão corretos.",
    };
  }

  // 3. Redirecionamento Final
  if (checkoutUrl) {
    console.log("🌐 [REDIRECT] Redirecionando para o gateway...");
    redirect(checkoutUrl);
  }
}
