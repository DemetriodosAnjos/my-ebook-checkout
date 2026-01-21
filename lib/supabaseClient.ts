import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Extraímos as variáveis com fallbacks para evitar quebra no build (prerendering)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// 1. Cliente Público: Tipado explicitamente
export const supabasePublic: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * 2. Cliente Admin: Protegido contra execução no Browser.
 * Substituímos 'any' por uma união de tipos (SupabaseClient | null).
 */
export const supabaseAdmin: SupabaseClient | null =
  typeof window === "undefined" && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

/**
 * Helper opcional: Caso você queira garantir que o admin existe antes de usar,
 * evitando checagens de 'null' repetitivas no seu código server-side.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    throw new Error(
      "❌ Tentativa de acessar supabaseAdmin fora do ambiente servidor ou sem service_key."
    );
  }
  return supabaseAdmin;
}
