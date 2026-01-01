"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Clock, RefreshCw, AlertCircle } from "lucide-react";
import { supabasePublic } from "@/lib/supabaseClient";
import Link from "next/link";
import "./pending.css";

function PendingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [showWaitMessage, setShowWaitMessage] = useState(false);

  const externalReference = searchParams.get("external_reference");

  // 🔄 Função Reutilizável de Verificação
  const checkPaymentStatus = async (isManual = false) => {
    if (!externalReference) return;

    if (isManual) setIsChecking(true);

    try {
      const { data, error } = await supabasePublic
        .from("sales")
        .select("status")
        .eq("external_reference", externalReference)
        .single();

      if (error) throw error;

      if (data?.status === "approved") {
        // Redireciona imediatamente para success
        router.push(`/success?external_reference=${externalReference}`);
      } else if (isManual) {
        // Se foi manual e ainda não aprovou, mostra aviso temporário
        setShowWaitMessage(true);
        setTimeout(() => setShowWaitMessage(false), 3000);
      }
    } catch (err) {
      console.error("Erro ao verificar status:", err);
    } finally {
      if (isManual) setIsChecking(false);
    }
  };

  // 🔄 Polling Silencioso (Background) - A cada 5 segundos
  useEffect(() => {
    if (!externalReference) return;

    const interval = setInterval(() => {
      // Não roda o polling se o usuário já estiver clicando manualmente
      if (!isChecking) {
        checkPaymentStatus(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [externalReference, isChecking]);

  return (
    <main className="pending-container">
      <div className="pending-card">
        <div className="pending-icon-wrapper">
          <Clock className="text-amber-500 animate-pulse" size={48} />
        </div>

        <h1 className="pending-title">Pagamento em Processamento</h1>

        <p className="pending-text">
          O Mercado Pago está confirmando sua transação. Geralmente leva alguns
          segundos. Assim que aprovado, esta página atualizará sozinha.
        </p>

        {showWaitMessage && (
          <div className="flex items-center gap-2 p-3 mb-4 text-sm text-amber-700 bg-amber-50 rounded-lg animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={16} />
            <span>
              Ainda não detectamos a aprovação. Se já pagou, aguarde 5 segundos
              e tente novamente.
            </span>
          </div>
        )}

        <div className="flex flex-col items-center w-full gap-3">
          <button
            onClick={() => checkPaymentStatus(true)}
            disabled={isChecking}
            className="pending-button-primary flex items-center justify-center gap-2 w-full"
          >
            {isChecking ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Verificando...
              </>
            ) : (
              "Verificar agora"
            )}
          </button>

          <Link href="/" className="pending-button-outline w-full text-center">
            Voltar para a Loja
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PendingPage() {
  return (
    <Suspense
      fallback={
        <main className="pending-container">
          <div className="pending-card flex items-center justify-center">
            <RefreshCw className="animate-spin text-amber-500" size={48} />
          </div>
        </main>
      }
    >
      <PendingPageContent />
    </Suspense>
  );
}
