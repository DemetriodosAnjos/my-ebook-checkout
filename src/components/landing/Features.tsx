import React from "react";
import {
  Zap,
  Wallet,
  ShieldCheck,
  Share2,
  MousePointerClick,
  Layout,
} from "lucide-react";
import "./Features.css";

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

const techStack: FeatureItem[] = [
  {
    title: "Next.js 15 & React 19",
    description:
      "Aproveite o poder das Server Actions e do novo React Compiler para performance extrema e SEO impecável.",
    icon: <Zap size={24} />,
  },
  {
    title: "Mercado Pago Hybrid",
    description:
      "Checkout pronto para Pix e Cartão com Webhooks automatizados. Dinheiro na conta e acesso liberado na hora.",
    icon: <Wallet size={24} />,
    highlight: true,
  },
  {
    title: "Tailwind CSS v4",
    description:
      "Estilização ultra-rápida com motor Oxide. CSS modular com metodologia BEM para um código limpo e escalável.",
    icon: <Layout size={24} />,
  },
  {
    title: "TypeScript Enterprise",
    description:
      "Arquitetura 100% tipada. Menos tempo corrigindo bugs, mais tempo escalando sua operação digital.",
    icon: <ShieldCheck size={24} />,
  },
  {
    title: "Entrega Automatizada",
    description:
      "Motor universal de entrega via Google Drive API. Venda PDFs, Links ou Arquivos com liberação imediata.",
    icon: <Share2 size={24} />,
  },
  {
    title: "Demo de Conversão",
    description:
      "Simule um fluxo real de compra por R$ 1,00 e veja a mágica da automação acontecer diante dos seus olhos.",
    icon: <MousePointerClick size={24} />,
    highlight: true,
  },
];

const Features: React.FC = () => {
  return (
    <section className="features">
      <div className="features__container">
        <div className="features__header">
          <h2 className="features__title">
            A Stack que as Big Techs usam,{" "}
            <span className="text-emerald-400">pronta para você.</span>
          </h2>
          <p className="features__subtitle">
            O que levaria semanas, agora leva 5 minutos. Uma estrutura completa,
            testada e pronta para o campo de batalha.
          </p>
        </div>

        <div className="features__grid">
          {techStack.map((item, index) => (
            <div
              key={index}
              className={`feature-card ${
                item.highlight ? "feature-card--highlight" : ""
              }`}
            >
              <div className="feature-card__icon">{item.icon}</div>
              <h3 className="feature-card__title">{item.title}</h3>
              <p className="feature-card__description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
