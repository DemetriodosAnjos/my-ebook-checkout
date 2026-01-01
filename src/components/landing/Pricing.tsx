"use client";

import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import CheckoutModal from "../checkout/CheckoutModal";
import "./Pricing.css";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
    price: string;
  } | null>(null);

  const plans = [
    {
      id: "anual",
      name: "Acesso Anual",
      price: "R$ 197",
      period: "/ano",
      description: "Ideal para quem está começando seu primeiro SaaS.",
      features: [
        "Next.js 15 Boilerplate",
        "Suporte via Discord",
        "Atualizações por 1 ano",
        "Documentação Completa",
      ],
      button: "Começar Agora",
      highlight: false,
    },
    {
      id: "vitalicio",
      name: "Acesso Vitalício",
      price: "R$ 497",
      period: "",
      description: "Para desenvolvedores sérios que querem escala real.",
      features: [
        "Tudo do plano Anual",
        "Atualizações Vitalícias",
        "Acesso ao Repositório Private",
        "Módulos de IA inclusos",
        "Suporte Prioritário",
      ],
      button: "Obter Acesso Vitalício",
      highlight: true,
    },
  ];

  return (
    <section className="pricing" id="pricing">
      <div className="pricing__container">
        <div className="pricing__header">
          <h2 className="pricing__title">
            Investimento que se{" "}
            <span className="text-emerald-400">paga em horas.</span>
          </h2>
          <p className="pricing__subtitle">
            Economize mais de 100 horas de setup e vá direto ao que importa: seu
            faturamento.
          </p>
        </div>

        <div className="pricing__grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing__card ${
                plan.highlight ? "pricing__card--highlight" : ""
              }`}
            >
              {plan.highlight && (
                <div className="pricing__badge">
                  <Sparkles size={14} /> MAIS POPULAR
                </div>
              )}

              <h3 className="pricing__plan-name">{plan.name}</h3>

              <div className="pricing__price-wrapper">
                <span className="pricing__currency">R$</span>
                <span className="pricing__price">
                  {plan.price.replace("R$ ", "")}
                </span>
                <span className="pricing__period">{plan.period}</span>
              </div>

              <p className="pricing__description">{plan.description}</p>

              <ul className="pricing__features">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="pricing__feature">
                    <Check size={18} className="text-emerald-500" /> {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  setSelectedPlan({
                    id: plan.id,
                    name: plan.name,
                    price: plan.price,
                  })
                }
                className={`pricing__button ${
                  plan.highlight
                    ? "pricing__button--primary"
                    : "pricing__button--outline"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal renderizado fora do grid para evitar conflitos de layout */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setSelectedPlan(null)}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          price={selectedPlan.price}
        />
      )}
    </section>
  );
};

export default Pricing;
