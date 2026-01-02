"use client";

import React from "react";
import { Check, ArrowRight, Zap } from "lucide-react";
import "./PricingResgate.css";

interface PricingResgateProps {
  userId: string;
}

const PricingResgate = ({ userId }: PricingResgateProps) => {
  // Valores com R$ 99,00 de desconto aplicados
  const plans = [
    {
      id: "anual",
      name: "Acesso Anual",
      originalPrice: "R$ 297",
      discountedPrice: "R$ 198",
      featured: false,
      benefits: [
        "1 Ano de Atualizações",
        "Acesso ao Repositório",
        "Suporte via Discord",
        "Documentação Completa",
      ],
    },
    {
      id: "vitalicio",
      name: "Acesso Vitalício",
      originalPrice: "R$ 497",
      discountedPrice: "R$ 398",
      featured: true,
      benefits: [
        "Atualizações Vitalícias",
        "Todos os Bônus Atuais",
        "Acesso Prioritário",
        "Licença Comercial Ilimitada",
      ],
    },
  ];

  const handleFinalPurchase = (planId: string) => {
    // Aqui você redireciona para o checkout final passando o userId (external_reference)
    // para que o backend saiba que este pagamento "queima" o voucher.
    console.log(`Iniciando checkout de ${planId} para o usuário ${userId}`);
    // Exemplo: window.location.href = `/api/checkout/final?plan=${planId}&ref=${userId}`;
  };

  return (
    <div className="pricing-resgate-grid">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`card-resgate ${plan.featured ? "featured" : ""}`}
        >
          <div className="badge-voucher">Voucher R$ 99 Aplicado</div>

          <span className="plan-name">{plan.name}</span>

          <div className="price-container">
            <span className="price-original">{plan.originalPrice}</span>
            <div className="flex items-baseline">
              <span className="price-discounted">{plan.discountedPrice}</span>
              <span className="price-suffix">/único</span>
            </div>
          </div>

          <ul className="benefits-list">
            {plan.benefits.map((benefit, index) => (
              <li key={index} className="benefit-item">
                <Check size={16} className="benefit-icon" />
                {benefit}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleFinalPurchase(plan.id)}
            className={`btn-checkout-resgate ${
              plan.featured ? "primary" : "secondary"
            }`}
          >
            {plan.featured ? <Zap size={18} /> : null}
            Garantir com Desconto
            <ArrowRight size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default PricingResgate;
