"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Zap, Loader2, Sparkles } from "lucide-react";
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
      oldPrice: "297",
      newPrice: "198",
      period: "/ano",
      description: "Ideal para validar seu primeiro SaaS rapidamente.",
      features: [
        "Next.js 15 Boilerplate",
        "Integração Mercado Pago",
        "Setup Supabase & Auth",
        "1 ano de Atualizações",
      ],
      highlight: false,
    },
    {
      id: "vitalício",
      name: "Acesso Vitalício",
      oldPrice: "497",
      newPrice: "398",
      period: "/vitalício",
      description: "O controle total do seu faturamento para sempre.",
      features: [
        "Tudo do plano Anual",
        "Acesso ao Repo Privado",
        "Suporte Prioritário Discord",
        "Desconto Adicional Aplicado",
      ],
      highlight: true,
    },
  ];

  return (
    <div className="pricing__grid pricing-resgate-custom">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`pricing__card ${
            plan.highlight ? "pricing__card--highlight" : ""
          }`}
        >
          {/* Badge de Voucher - Centralizado e chamativo */}
          <div className="pricing__badge pricing__badge--resgate">
            <Sparkles size={14} /> R$ 99,00 OFF APLICADO
          </div>

          <h3 className="pricing__plan-name mt-4">{plan.name}</h3>

          <div className="pricing__price-wrapper !flex-col !items-start gap-1">
            <span className="text-slate-500 line-through text-lg font-medium">
              R$ {plan.oldPrice}
            </span>
            <div className="flex items-baseline">
              <span className="pricing__currency">R$</span>
              <span className="pricing__price">{plan.newPrice}</span>
              <span className="pricing__period">{plan.period}</span>
            </div>
          </div>

          <p className="pricing__description">{plan.description}</p>

          <ul className="pricing__features">
            {plan.features.map((feat, idx) => (
              <li key={idx} className="pricing__feature">
                <Check size={18} className="text-emerald-500" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handlePurchase(plan.id)}
            disabled={!!loading}
            className={`pricing__button ${
              plan.highlight
                ? "pricing__button--primary"
                : "pricing__button--outline"
            } flex items-center justify-center gap-2`}
          >
            {loading === plan.id ? (
              <Loader2 className="animate-spin" />
            ) : plan.highlight ? (
              <Zap size={18} />
            ) : null}
            {loading === plan.id ? "Processando..." : "Garantir com Desconto"}
            {loading !== plan.id && <ArrowRight size={18} />}
          </button>
        </div>
      ))}
    </div>
  );
}
