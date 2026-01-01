"use client";

import React, { useState } from "react";
import { Check, Sparkles, TestTube } from "lucide-react"; // Importei TestTube para o ícone de teste
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
      id: "teste", // ID que deve bater com o backend
      name: "Plano de Teste",
      price: "R$ 0,55",
      period: "/único",
      description:
        "Valide o fluxo de pagamento real com o menor valor possível.",
      features: [
        "Checkout Real (Pix)",
        "Teste de Webhooks",
        "Teste de E-mail",
        "Redirecionamento Automático",
      ],
      button: "Testar Agora",
      highlight: false,
      isTest: true, // Flag opcional para estilização
    },
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
              } ${plan.isTest ? "pricing__card--test" : ""}`}
            >
              {plan.highlight && (
                <div className="pricing__badge">
                  <Sparkles size={14} /> MAIS POPULAR
                </div>
              )}

              {/* Badge visual para o plano de teste */}
              {plan.isTest && (
                <div className="pricing__badge bg-amber-500/20 text-amber-400 border-amber-500/30">
                  <TestTube size={14} /> AMBIENTE REAL
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
                    <Check
                      size={18}
                      className={
                        plan.isTest ? "text-amber-500" : "text-emerald-500"
                      }
                    />{" "}
                    {feat}
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
                    : plan.isTest
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "pricing__button--outline"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>

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
