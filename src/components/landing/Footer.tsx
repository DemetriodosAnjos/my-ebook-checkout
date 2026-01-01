import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <h2 className="footer__logo">
              Boilerplate<span className="text-emerald-400">SaaS</span>
            </h2>
            <p className="footer__tagline">
              A estrutura definitiva para quem não tem tempo a perder. Venda,
              entregue e escale seu SaaS hoje.
            </p>
          </div>

          <div className="footer__nav">
            <div className="footer__column">
              <h4 className="footer__column-title">Produto</h4>
              <ul className="footer__links">
                <li>
                  <a href="#features">Funcionalidades</a>
                </li>
                <li>
                  <a href="#demo">Demonstração</a>
                </li>
                <li>
                  <a href="#pricing">Preços</a>
                </li>
              </ul>
            </div>

            <div className="footer__column">
              <h4 className="footer__column-title">Suporte</h4>
              <ul className="footer__links">
                <li>
                  <a href="#faq">Dúvidas</a>
                </li>
                <li>
                  <a href="mailto:suporte@seudominio.com">E-mail</a>
                </li>
                <li>
                  <a href="#">Documentação</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__divider"></div>

        <div className="footer__bottom">
          <div className="footer__info">
            <p>
              &copy; {currentYear} Seu Nome ou Empresa. Todos os direitos
              reservados.
            </p>
          </div>
          <div className="footer__payment">
            <span className="footer__payment-text">Pagamento Seguro via</span>
            <div className="footer__payment-badge">Mercado Pago</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
