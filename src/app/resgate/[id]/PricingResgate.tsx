"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Zap, Loader2 } from "lucide-react";
import { createDiscountedCheckout } from "@/app/actions/checkoutResgate";
import "./PricingResgate.css";

export default function PricingResgate({ userId }: { userId: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (planId: string) => {
    try {
      setLoading(planId);
      const { init_point } = await createDiscountedCheckout(planId, userId);
      if (init_point) window.location.href = init_point;
    } catch (err) {
      alert("Erro ao aplicar desconto ou voucher expirado.");
      window.location.reload();
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: "anual",
      name: "Acesso Anual",
      old: "R$ 297",
      new: "R$ 198",
      feat: false,
    },
    {
      id: "vitalicio",
      name: "Acesso Vitalício",
      old: "R$ 497",
      new: "R$ 398",
      feat: true,
    },
  ];

  return (
    <div className="pricing-resgate-grid">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`card-resgate ${plan.feat ? "featured" : ""}`}
        >
          <div className="badge-voucher">R$ 99 OFF ATIVADO</div>
          <span className="plan-name">{plan.name}</span>
          <div className="price-container">
            <span className="price-original">{plan.old}</span>
            <div className="flex items-baseline">
              <span className="price-discounted">{plan.new}</span>
            </div>
          </div>
          <button
            onClick={() => handlePurchase(plan.id)}
            disabled={!!loading}
            className={`btn-checkout-resgate ${
              plan.feat ? "primary" : "secondary"
            }`}
          >
            {loading === plan.id ? (
              <Loader2 className="animate-spin" />
            ) : plan.feat ? (
              <Zap size={18} />
            ) : null}
            {loading === plan.id ? "Processando..." : "Garantir com Desconto"}
            <ArrowRight size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
