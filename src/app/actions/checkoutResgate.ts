"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { config } from "@/lib/config";

const client = new MercadoPagoConfig({
  accessToken: config.mercadopago.accessToken,
});

export async function createDiscountedCheckout(
  planId: string,
  externalReference: string
) {
  if (!supabaseAdmin) throw new Error("DB Connection fail");

  // 1. Validar se o voucher ainda é válido no servidor antes de abrir o checkout
  const { data: sale } = await supabaseAdmin
    .from("sales")
    .select("voucher_expires_at, voucher_used")
    .eq("external_reference", externalReference)
    .single();

  const now = new Date();
  const expiresAt = sale?.voucher_expires_at
    ? new Date(sale.voucher_expires_at)
    : null;

  if (sale?.voucher_used || !expiresAt || now > expiresAt) {
    throw new Error("Voucher expirado ou já utilizado.");
  }

  // 2. Definir preços reais (Subtraindo R$ 99)
  const prices: Record<string, number> = {
    anual: 297 - 99, // 198
    vitalicio: 497 - 99, // 398
  };

  const amount = prices[planId] || 398;

  // 3. Criar a preferência no Mercado Pago
  const preference = await new Preference(client).create({
    body: {
      items: [
        {
          id: planId,
          title: `Boilerplate 5TB - ${planId.toUpperCase()} (Voucher Aplicado)`,
          quantity: 1,
          unit_price: amount,
          currency_id: "BRL",
        },
      ],
      external_reference: externalReference, // Mantemos a mesma REF para atualizar o mesmo registro no banco
      metadata: {
        is_simulation: false, // Aqui é venda REAL
        plan_type: planId,
      },
      back_urls: {
        success: `${config.siteUrl}/success`,
      },
      auto_return: "approved",
    },
  });

  return { init_point: preference.init_point };
}
