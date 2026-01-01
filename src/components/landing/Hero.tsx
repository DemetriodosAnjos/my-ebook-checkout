"use client";
import React from "react";
import "./Hero.css";
import { ArrowRight, Play } from "lucide-react";

// Definindo a interface para as propriedades do componente
interface HeroProps {
  onAction: () => void; // Esta função será o scroll para o Pricing
}

const Hero: React.FC<HeroProps> = ({ onAction }) => {
  return (
    <section className="hero">
      <div className="hero__container">
        <span className="hero__badge">Next.js 15 + Tailwind 4 Ready</span>

        <h1 className="hero__title">
          Pare de configurar. <br />
          <span className="text-emerald-400">Comece a faturar.</span>
        </h1>

        <p className="hero__description">
          O Boilerplate definitivo para quem não tem tempo a perder. Venda seus
          produtos digitais com a estrutura usada pelas grandes startups,
          configurada em minutos, não semanas.
        </p>

        <div className="hero__actions">
          {/* Botão Principal: Agora executa a prop onAction */}
          <button
            onClick={onAction}
            className="header__button header__button--primary px-8 py-4 text-base flex items-center gap-2"
          >
            Obter Acesso Imediato
            <ArrowRight size={20} />
          </button>

          {/* Botão Secundário: Também pode levar ao Pricing para simulação */}
          <button
            onClick={onAction}
            className="header__button header__button--outline px-8 py-4 text-base flex items-center gap-2"
          >
            <Play size={18} fill="currentColor" /> Simular Compra (R$ 1,00)
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
