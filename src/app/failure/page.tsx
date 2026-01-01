"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { supabasePublic } from "@/lib/supabaseClient";
import Link from "next/link";
import "./failure.css";

export const dynamic = "force-dynamic";

function FailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "failure" | "error">(
    "loading"
  );
  const externalReference = searchParams.get("external_reference");

  useEffect(() => {
    if (!externalReference) {
      setStatus("error");
      return;
    }

    const checkStatus = async () => {
      const { data } = await supabasePublic
        .from("sales")
        .select("status")
        .eq("external_reference", externalReference)
        .single();

      if (data?.status === "approved") {
        router.push(`/success?external_reference=${externalReference}`);
      } else if (data?.status === "pending") {
        router.push(`/pending?external_reference=${externalReference}`);
      } else if (data?.status === "rejected" || data?.status === "cancelled") {
        setStatus("failure");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 8000);
    return () => clearInterval(interval);
  }, [externalReference, router]);

  if (status === "loading") {
    return <Loader2 className="animate-spin text-zinc-500 mt-20" size={48} />;
  }

  return (
    <div className="failure-card">
      <div className="failure-icon-wrapper">
        <XCircle className="icon-red" size={64} strokeWidth={2} />
      </div>

      <h1 className="failure-title">
        {status === "failure" ? "Pagamento Recusado" : "Ops! Algo deu errado"}
      </h1>

      <p className="failure-text">
        {status === "failure"
          ? "Seu pagamento não foi aprovado pela operadora. Tente novamente com outro cartão ou método."
          : "Não conseguimos localizar seu pedido. Se você já pagou, aguarde alguns instantes."}
      </p>

      <Link href="/" className="failure-button-primary">
        Tentar Novamente
      </Link>
    </div>
  );
}

export default function FailurePage() {
  return (
    <main className="failure-container">
      <Suspense
        fallback={<Loader2 className="animate-spin text-red-500" size={48} />}
      >
        <FailureContent />
      </Suspense>
    </main>
  );
}
