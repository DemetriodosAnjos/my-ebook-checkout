import React from "react";
import {
  Zap,
  Wallet,
  ShieldCheck,
  Share2,
  MousePointerClick,
  Layout,
} from "lucide-react";
import FeaturesDemo from "./FeaturesDemo";
import "./Features.css";
import FeeComparison from "./FeeComparison";

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

const techStack: FeatureItem[] = [
  {
    title: "Infraestrutura de Elite",
    description:
      "Next.js 15 e React 19. Server Actions e React Compiler para quem não aceita menos que performance extrema.",
    icon: <Zap size={24} />,
  },
  {
    title: "Vendas no Piloto Automático",
    description:
      "Mercado Pago Hybrid (Pix/Cartão). O dinheiro cai na conta e o sistema libera o acesso sem você tocar em nada.",
    icon: <Wallet size={24} />,
    highlight: true,
  },
  {
    title: "Design de Próxima Geração",
    description:
      "Tailwind v4 com motor Oxide. CSS modular e limpo que não vira uma bagunça quando o projeto cresce.",
    icon: <Layout size={24} />,
  },
  {
    title: "Segurança de Big Tech",
    description:
      "TypeScript Enterprise. Arquitetura 100% tipada para você parar de debugar erros bobos em produção.",
    icon: <ShieldCheck size={24} />,
  },
  {
    title: "Entrega Digital Universal",
    description:
      "Integração nativa com Google Drive API. Venda qualquer arquivo digital com liberação imediata pós-venda.",
    icon: <Share2 size={24} />,
  },
  {
    title: "Teste a Automação",
    description:
      "Simule um fluxo real por R$ 1,00. Veja o webhook trabalhando e receba o produto no seu e-mail agora.",
    icon: <MousePointerClick size={24} />,
    highlight: true,
  },
];

const Features: React.FC = () => {
  return (
    <section className="features">
      <FeaturesDemo />
      <FeeComparison />
      <div className="features__container">
        <div className="features__header">
          <h2 className="features__title">
            Pare de configurar,{" "}
            <span className="text-emerald-400">comece a vender.</span>
          </h2>
          <p className="features__subtitle">
            O que levaria semanas configurando Webhooks e APIs, aqui leva 5
            minutos. A estrutura testada e pronta para o campo de batalha.
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
