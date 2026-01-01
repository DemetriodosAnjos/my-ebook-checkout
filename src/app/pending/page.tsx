"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Clock, Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import { supabasePublic } from "@/lib/supabaseClient";
import Link from "next/link";
import "../pending/pending.css";

function PendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<string>("pending");

  const externalReference = searchParams.get("external_reference");

  // 🔄 Polling Silencioso (Background)
  useEffect(() => {
    if (!externalReference) return;

    const interval = setInterval(async () => {
      const { data } = await supabasePublic
        .from("sales")
        .select("status")
        .eq("external_reference", externalReference)
        .single();

      if (data?.status === "approved") {
        router.push(`/success?external_reference=${externalReference}`);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [externalReference, router]);

  // ✅ Verificação Manual ao clicar no botão
  const handleManualCheck = async () => {
    if (!externalReference) return;

    setIsChecking(true);
    try {
      const { data } = await supabasePublic
        .from("sales")
        .select("status")
        .eq("external_reference", externalReference)
        .single();

      if (data?.status === "approved") {
        router.push(`/success?external_reference=${externalReference}`);
      } else {
        // Delay visual para o usuário sentir que a verificação ocorreu
        setTimeout(() => {
          setIsChecking(false);
          setStatus(data?.status || "pending");
        }, 800);
      }
    } catch (err) {
      console.error("Erro no check manual:", err);
      setIsChecking(false);
    }
  };

  return (
    <main className="pending-container">
      <div className="pending-card">
        <div className="pending-icon-wrapper">
          <Clock className="text-amber-500 animate-pulse" size={48} />
        </div>

        <h1 className="pending-title">Pagamento em Processamento</h1>

        {/* Badge de status opcional - seguindo o modelo limpo de success */}
        <p className="pending-text">
          O Mercado Pago está confirmando sua transação. Geralmente leva alguns
          segundos. Não se preocupe, você também receberá os detalhes por
          e-mail.
        </p>

        <div className="flex flex-col items-center w-full">
          <button
            onClick={handleManualCheck}
            disabled={isChecking}
            className="pending-button-primary"
          >
            {isChecking ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              "Verificar agora"
            )}
          </button>

          <Link href="/" className="pending-button-outline">
            Voltar para a Loja
          </Link>
        </div>
      </div>
    </main>
  );
}

export default PendingContent;
