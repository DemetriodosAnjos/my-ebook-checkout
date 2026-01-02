"use client";

import React, { useState } from "react";
import { Check, Sparkles, TestTube, Gift } from "lucide-react";
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
      name: "Simular Webhook",
      price: "0,99",
      period: "/único",
      description: "Valide o fluxo real e libere seu voucher de R$ 99,00.",
      features: [
        "Checkout Real via Pix",
        "Teste de Webhooks Real-time",
        "Receba E-mail de Entrega",
        "Ganha Voucher de R$ 99,00 OFF", // Reforço da oferta do Hero
      ],
      button: "Testar Agora",
      highlight: false,
      isTest: true,
    },
    {
      id: "anual",
      name: "Acesso Anual",
      price: "297",
      period: "/ano",
      description: "Ideal para validar seu primeiro projeto SaaS rapidamente.",
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
      description: "O controle total do seu faturamento para sempre.",
      features: [
        "Tudo do plano Anual",
        "Acesso ao Repo Privado",
        "Suporte Prioritário Discord",
        "Aceita Voucher de R$ 99,00", // Ancoragem do desconto
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
            Escolha o plano ideal para o seu momento. Teste nossa tecnologia por
            menos de um real.
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
                  <Gift size={14} /> GANHE R$ 99,00 OFF
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
                    <span
                      className={
                        feat.includes("R$ 99,00")
                          ? "font-bold text-emerald-400"
                          : ""
                      }
                    >
                      {feat}
                    </span>
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
