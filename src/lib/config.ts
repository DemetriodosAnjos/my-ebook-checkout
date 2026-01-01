export const config = {
  mercadopago: {
    publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!,
    accessToken: process.env.MP_ACCESS_TOKEN!,
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // Chave mestre para o supabaseAdmin (Server-side only)
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  google: {
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")!,
  },
  // Dica: Adicione a URL do site para os redirects do Mercado Pago
  siteUrl: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
};
