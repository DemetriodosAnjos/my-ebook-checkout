"use client";

import React from "react";
import { X, Check, Info } from "lucide-react";
import "./FeeComparison.css";

const FeeComparison: React.FC = () => {
  const fees = [
    {
      label: "Comissão Variável",
      platformA: "9,9%",
      platformB: "8,99%",
      yours: "0%",
    },
    {
      label: "Taxa Fixa (por venda)",
      platformA: "R$ 1,00",
      platformB: "R$ 2,49",
      yours: "R$ 0,00",
    },
    {
      label: "Hospedagem de Vídeo",
      platformA: "R$ 2,49",
      platformB: "Grátis",
      yours: "Custo Zero",
    },
    {
      label: "Saque Bancário",
      platformA: "R$ 1,99",
      platformB: "R$ 3,67",
      yours: "Instantâneo (Pix)",
    },
    {
      label: "Juros Parcelamento",
      platformA: "3,49% a.m.",
      platformB: "3,49% a.m.",
      yours: "Taxa Direta MP",
    },
  ];

  return (
    <section className="fees">
      <div className="fees__container">
        <div className="fees__header">
          <h2 className="fees__title">
            A conta que as plataformas{" "}
            <span className="text-emerald-400">não querem que você faça.</span>
          </h2>
          <p className="fees__subtitle">
            Compare o "pedágio" que você paga hoje por cada venda realizada.
          </p>
        </div>

        <div className="fees__table-wrapper">
          <table className="fees__table">
            <thead>
              <tr>
                <th>Custo de Intermediação</th>
                <th>Plataforma "A"</th>
                <th>Plataforma "B"</th>
                <th className="fees__th--highlight">Seu Boilerplate</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee, index) => (
                <tr key={index}>
                  <td className="fees__label">{fee.label}</td>
                  <td className="fees__value--bad">{fee.platformA}</td>
                  <td className="fees__value--bad">{fee.platformB}</td>
                  <td className="fees__value--good">{fee.yours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fees__footer">
          <div className="fees__alert">
            <Info size={20} className="text-emerald-400" />
            <p>
              Em um faturamento de <strong>R$ 10.000</strong>, você deixa até{" "}
              <strong>R$ 1.200</strong> na mesa. Com o nosso sistema, esse lucro
              é 100% seu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeeComparison;
