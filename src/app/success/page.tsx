"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { supabasePublic } from "@/lib/supabaseClient";
import Link from "next/link";
import "./success.css";

export const dynamic = "force-dynamic";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>("approved"); // Força o Sucesso

  const externalReference = searchParams.get("external_reference");

  // ⏳ Simulação de delay para processamento do webhook
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // 🔄 Polling do status no Supabase
  useEffect(() => {
    if (loading || !externalReference) return;

    const checkStatus = async () => {
      try {
        const { data, error } = await supabasePublic
          .from("sales")
          .select("status")
          .eq("external_reference", externalReference)
          .single();

        if (!error && data) {
          setStatus(data.status);
        }
      } catch (err) {
        console.error("Erro ao consultar status:", err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 4000); // Tenta a cada 4s
    return () => clearInterval(interval);
  }, [loading, externalReference]);

  // UI: Carregando Inicial
  if (loading || (status === "pending" && !status)) {
    return (
      <div className="status-card">
        <Loader2
          className="status-icon animate-spin text-emerald-500"
          size={48}
        />
        <h1 className="status-title text-zinc-100">Processando...</h1>
        <p className="status-text text-zinc-400">
          Estamos confirmando seu pagamento com o Mercado Pago.
        </p>
      </div>
    );
  }

  // UI: Aprovado
  if (status === "approved") {
    return (
      <div className="status-card">
        <div className="status-icon-wrapper">
          <CheckCircle2 className="text-emerald-500" size={48} />
        </div>
        <h1 className="status-title text-zinc-100">Acesso Liberado!</h1>
        <p className="status-text text-zinc-400">
          Seu pagamento foi confirmado. Enviamos as instruções de acesso para o
          seu e-mail.
        </p>
        <Link href="/" className="status-button-primary">
          Ok! Entendi
        </Link>
      </div>
    );
  }

  // UI: Pendente/Aguardando
  if (status === "pending" || status === "in_process") {
    return (
      <div className="status-card">
        <Clock className="status-icon text-amber-500 animate-pulse" size={48} />
        <h1 className="status-title text-zinc-100">Quase lá...</h1>
        <p className="status-text text-zinc-400">
          O pagamento está em análise. Assim que aprovado, você receberá o
          e-mail automaticamente.
        </p>
        <Link href="/" className="status-button-outline">
          Voltar para Home
        </Link>
      </div>
    );
  }

  // UI: Erro ou Falha
  return (
    <div className="status-card">
      <XCircle className="status-icon text-red-500" size={48} />
      <h1 className="status-title text-zinc-100">Algo deu errado</h1>
      <p className="status-text text-zinc-400">
        Não conseguimos localizar seu pagamento. Se houve cobrança, entre em
        contato com o suporte.
      </p>
      <Link href="/#pricing" className="status-button-outline">
        Tentar novamente
      </Link>
    </div>
  );
}

// O App Router exige Suspense para usar useSearchParams
export default function SuccessPage() {
  return (
    <main className="status-container">
      <Suspense
        fallback={
          <Loader2 className="animate-spin text-emerald-500" size={48} />
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
