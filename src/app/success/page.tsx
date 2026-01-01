"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { supabasePublic } from "@/lib/supabaseClient";
import Link from "next/link";
import "./success.css";

// 1. Componente de Conteúdo (Lógica)
function SuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>("approved");

  const externalReference = searchParams.get("external_reference");

  // ⏳ Delay inicial
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // 🔄 Polling do status
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
    const interval = setInterval(checkStatus, 4000);
    return () => clearInterval(interval);
  }, [loading, externalReference]);

  // UI: Carregando
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

  // UI: Pendente
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

  // UI: Erro
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

// 2. Exportação Principal com Suspense Boundary
export default function SuccessPage() {
  return (
    <main className="status-container">
      <Suspense
        fallback={
          <div className="status-card">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
            <h1 className="status-title text-zinc-100">Carregando...</h1>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
