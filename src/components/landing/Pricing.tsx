"use client";

import React, { useState } from "react";
import { Check, Sparkles, TestTube, Rocket, ShieldCheck } from "lucide-react";
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
      id: "teste",
      name: "Ambiente de Teste",
      price: "0,55",
      period: "/único",
      description:
        "Valide o fluxo real de aprovação e entrega automática agora.",
      features: [
        "Checkout Real (Pix)",
        "Teste de Webhooks Real-time",
        "Disparo de E-mail de Entrega",
        "Redirecionamento Pós-venda",
      ],
      button: "Testar Fluxo",
      highlight: false,
      isTest: true,
    },
    {
      id: "anual",
      name: "Acesso Anual",
      price: "297",
      period: "/ano",
      description: "Para quem quer lançar o primeiro SaaS com segurança.",
      features: [
        "Next.js 15 Boilerplate",
        "Integração Mercado Pago",
        "Setup Supabase & Auth",
        "1 Ano de Atualizações",
      ],
      button: "Começar Agora",
      highlight: false,
    },
    {
      id: "vitalicio",
      name: "Acesso Vitalício",
      price: "497",
      period: "/vitalício",
      description: "Para desenvolvedores sérios que buscam escala ilimitada.",
      features: [
        "Tudo do plano Anual",
        "Acesso ao Repo Privado",
        "Módulos de IA inclusos",
        "Suporte Prioritário Discord",
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
            Economize mais de 40 horas de setup manual. O que levava semanas,
            agora leva 5 minutos.
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

              {plan.isTest && (
                <div className="pricing__badge pricing__badge--test">
                  <TestTube size={14} /> LAB DE TESTE
                </div>
              )}

              <h3 className="pricing__plan-name">{plan.name}</h3>

              <div className="pricing__price-wrapper">
                <span className="pricing__currency">R$</span>
                <span className="pricing__price">{plan.price}</span>
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
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  setSelectedPlan({
                    id: plan.id,
                    name: plan.name,
                    price: `R$ ${plan.price}`,
                  })
                }
                className={`pricing__button ${
                  plan.highlight
                    ? "pricing__button--primary"
                    : plan.isTest
                    ? "pricing__button--test"
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
