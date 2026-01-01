import React from "react";
import {
  CheckCircle2,
  Rocket,
  Code2,
  Briefcase,
  GraduationCap,
  Globe,
} from "lucide-react";
import "./TargetAudience.css";

const audiences = [
  {
    icon: <Rocket className="target-icon" />,
    title: "Infoprodutores & Creators",
    description:
      "Pare de pagar taxas abusivas (10%+) de plataformas de cursos. Tenha seu próprio sistema de vendas, receba via Pix e entregue PDFs, Planilhas ou Acessos direto no e-mail do cliente, mantendo 100% do lucro.",
  },
  {
    icon: <Code2 className="target-icon" />,
    title: "Desenvolvedores Freelancers",
    description:
      "Ganhe tempo de vida. Não cobre apenas pelo design, entregue um sistema de vendas funcional para seus clientes em tempo recorde. O que você levaria 2 semanas para configurar, agora entrega em 1 dia.",
  },
  {
    icon: <Briefcase className="target-icon" />,
    title: "Agências de Software",
    description:
      "Padronize seu workflow. Use essa base sólida para escalar a criação de Landing Pages com checkout integrado para seus clientes, sem precisar reinventar a roda do webhook em cada projeto.",
  },
  {
    icon: <GraduationCap className="target-icon" />,
    title: "Desenvolvedores Iniciantes",
    description:
      "Aprenda como funciona um fluxo real de Big Tech. Estude um código limpo, tipado e pronto para produção. É o atalho perfeito para sair do 'Todo List' e criar algo que gera receita real.",
  },
  {
    icon: <Globe className="target-icon" />,
    title: "Empreendedores Solo",
    description:
      "Valide sua ideia de SaaS ou Micro-SaaS hoje. Não gaste meses construindo o sistema de pagamento. Foque no seu core business enquanto o boilerplate cuida de toda a burocracia do checkout.",
  },
];

const TargetAudience: React.FC = () => {
  return (
    <section className="target">
      <div className="target__container">
        <div className="target__header">
          <h2 className="target__title">
            Para quem é este{" "}
            <span className="text-emerald-400">Boilerplate?</span>
          </h2>
          <p className="target__subtitle">
            Feito para quem não tem tempo a perder e precisa de uma estrutura
            que aguenta o tranco do tráfego real.
          </p>
        </div>

        <div className="target__list">
          {audiences.map((item, index) => (
            <div key={index} className="target-item">
              <div className="target-item__icon-wrapper">{item.icon}</div>
              <div className="target-item__content">
                <h3 className="target-item__title">{item.title}</h3>
                <p className="target-item__description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
