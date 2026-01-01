import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 1. Cliente Público: Seguro para usar em qualquer lugar (Browser e Server)
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

// 2. Cliente Admin: PROTEGIDO. Só inicializa no Servidor.
// Isso evita o erro "supabaseKey is required" no navegador.
export const supabaseAdmin =
  typeof window === "undefined"
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    : (null as any);
