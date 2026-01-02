"use server";

import { v4 as uuidv4 } from "uuid";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { config } from "@/lib/config";
import { redirect } from "next/navigation";

// Definição de tipos para erros do Mercado Pago (ou similares)
interface CheckoutError extends Error {
  response?: {
    data?: unknown;
    status?: number;
  };
  cause?: unknown;
}

const client = new MercadoPagoConfig({
  accessToken: config.mercadopago.accessToken,
});
const preferenceClient = new Preference(client);

const PLAN_PRICES: Record<string, number> = {
  teste: 0.99,
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
    if (!supabaseAdmin) {
      throw new Error("Configuração do Banco de Dados ausente.");
    }

    // 1. Registro no Supabase
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
          success: `${config.siteUrl}/success?external_reference=${external_reference}`,
          failure: `${config.siteUrl}/failure`,
          pending: `${config.siteUrl}/pending?external_reference=${external_reference}`,
        },
        auto_return: "approved",
      },
    });

    checkoutUrl = result.init_point;
  } catch (err: unknown) {
    // Tratamento de redirect interno do Next.js
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }

    // Tipagem segura do erro para LOG
    const error = err as CheckoutError;

    console.error("🔥 [FALHA NO CHECKOUT]:", {
      message: error.message || "Erro desconhecido",
      mp_data: error.response?.data, // Aqui aparece o motivo real do MP (ex: token inválido)
      stack: error.stack,
    });

    return {
      error:
        "Ocorreu um erro ao processar o pagamento. Verifique os logs do servidor.",
    };
  }

  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}
