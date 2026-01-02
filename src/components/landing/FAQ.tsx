"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import "./FAQ.css";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "O acesso ao repositório é imediato?",
    answer:
      "Sim! Assim que o seu Pix ou cartão é aprovado, nosso webhook processa a venda e você recebe um e-mail com as instruções de acesso ao repositório privado e ao Google Drive.",
  },
  {
    question: "Preciso de conta PJ no Mercado Pago?",
    answer:
      "Não. Você pode usar sua conta de pessoa física (CPF) normalmente para receber suas vendas. O boilerplate já está configurado para ambos.",
  },
  {
    question: "Quais tecnologias vou precisar dominar?",
    answer:
      "O projeto usa Next.js 15, TypeScript e Tailwind. Se você conhece o básico de React, conseguirá subir seu projeto em minutos seguindo nossa documentação.",
  },
  {
    question: "Posso usar em projetos de clientes?",
    answer:
      "Com certeza. A licença permite que você use o boilerplate como base para quantos projetos quiser, agilizando sua entrega e aumentando seu lucro por job.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq">
      <div className="faq__container">
        <div className="faq__header">
          <h2 className="faq__title">
            Dúvidas <span className="text-emerald-400">Frequentes</span>
          </h2>
          <p className="faq__subtitle">
            Tudo o que você precisa saber sobre o Boilerplate SaaS.
          </p>
        </div>

        <div className="faq__list">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${
                openIndex === index ? "faq-item--open" : ""
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-item__header">
                <h3>{item.question}</h3>
                <div className="faq-item__icon">
                  {openIndex === index ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </div>
              <div
                className={`faq-item__answer ${
                  openIndex === index ? "faq-item__answer--visible" : ""
                }`}
              >
                <div className="faq-item__content">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
