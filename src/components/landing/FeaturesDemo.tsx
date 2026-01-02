"use client";

import React from "react";
import "./FeaturesDemo.css";

const FeaturesDemo: React.FC = () => {
  return (
    <section className="featuresdemo" id="featuresdemo">
      <div className="features-demo">
        <div className="features-demo__browser">
          <div className="features-demo__toolbar">
            <div className="features-demo__dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="features-demo__address">
              localhost:3000/app/checkout
            </div>
          </div>
          <div className="features-demo__video-container">
            {/* Substitua a div abaixo pelo seu <video src="..." /> quando tiver gravado */}
            <div className="features-demo__placeholder">
              <div className="play-button">▶</div>
              <p>Assista ao Fluxo de Venda Automática</p>
              <small className="text-emerald-400/60">
                (Pagamento → Webhook → Entrega)
              </small>
            </div>
          </div>
        </div>

        <div className="features-demo__badges">
          <div className="demo-badge">
            <span className="badge-dot"></span> 100% Automatizado
          </div>
          <div className="demo-badge">
            <span className="badge-dot"></span> Webhook Validado
          </div>
          <div className="demo-badge">
            <span className="badge-dot"></span> Email Transacional Ativo
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesDemo;
