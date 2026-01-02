"use client";
import React from "react";
import "./Hero.css";
import { ArrowRight, Play } from "lucide-react";

interface HeroProps {
  onAction: () => void;
}

const Hero: React.FC<HeroProps> = ({ onAction }) => {
  return (
    <section className="hero">
      <div className="hero__container">
        <span className="hero__badge">Next.js 15 + Tailwind 4 Ready</span>

        <h1 className="hero__title">
          Venda e receba <br />
          <span className="text-emerald-400">sem intermediários.</span>
        </h1>

        <p className="hero__description">
          Uma plataforma de recebimento direto na sua conta, sem taxas abusivas
          e sem sócios ocultos. O boilerplate definitivo para quem quer o
          controle total do faturamento e a performance das grandes startups.
        </p>

        <div className="hero__actions">
          <button
            onClick={onAction}
            className="header__button header__button--primary px-8 py-4 text-base flex items-center gap-2"
          >
            Obter Acesso Imediato
            <ArrowRight size={20} />
          </button>

          <button
            onClick={onAction}
            /* Mantive as classes originais e adicionei apenas flex-col para o novo texto */
            className="header__button header__button--outline px-8 py-4 text-base flex flex-col items-center leading-tight transition-transform active:scale-95"
          >
            <span className="flex items-center gap-2">
              <Play size={18} fill="currentColor" /> Teste o Webhook (R$ 0,99)
            </span>
            {/* Texto estratégico injetado sem alterar o CSS pai */}
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter mt-1">
              + Ganhe R$ 99,00 de desconto real
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
