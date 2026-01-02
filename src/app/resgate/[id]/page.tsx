import { supabaseAdmin } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import TimerDisplay from "./TimerDisplay";
import PricingResgate from "./PricingResgate";
import "./Resgate.css";

export default async function ResgatePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const { data: sale, error } = await supabaseAdmin
    .from("sales")
    .select("name, voucher_expires_at, voucher_used, status")
    .eq("external_reference", id)
    .single();

  if (error || !sale || sale.status !== "approved") return notFound();

  if (sale.voucher_used) {
    return (
      <main className="resgate-page">
        <div className="expired-box text-white font-bold">
          Este voucher já foi utilizado.
        </div>
      </main>
    );
  }

  const expiresAt = new Date(sale.voucher_expires_at).getTime();
  const now = new Date().getTime();

  if (now > expiresAt) {
    return (
      <main className="resgate-page">
        <div className="expired-box">
          <h2 className="text-2xl font-bold text-red-500">
            Voucher Expirado ❌
          </h2>
          <p className="text-zinc-400 mt-2">
            O tempo limite de 20 minutos acabou.
          </p>
          <a
            href="/#pricing"
            className="mt-6 text-emerald-400 underline font-bold"
          >
            Ver preços originais
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="resgate-page">
      <div className="resgate-header">
        <div className="status-badge">WEBHOOK VALIDADO COM SUCESSO</div>
        <h1 className="resgate-title">
          Parabéns, {sale.name.split(" ")[0]}! <br />
          Voucher de <span className="text-emerald-400">R$ 99,00 OFF</span>{" "}
          ativo.
        </h1>
        <TimerDisplay targetDate={expiresAt} />
      </div>

      <div className="resgate-content">
        <p className="resgate-instruction">
          O desconto já foi aplicado aos planos abaixo. Escolha o seu acesso:
        </p>
        <PricingResgate userId={id} />
      </div>

      <footer className="resgate-footer">
        Atenção: Se sair desta página ou o tempo zerar, o voucher será
        redistribuído.
      </footer>
    </main>
  );
}
