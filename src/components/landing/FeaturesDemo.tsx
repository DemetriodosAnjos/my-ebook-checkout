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
              https://boilerplate-nodw.vercel.app/
            </div>
          </div>
          <div className="features-demo__video-container">
            <iframe
              className="features-demo__video-iframe"
              src="https://www.youtube.com/embed/W3E07I9tRo8?si=bXLwiTj6o3VBhy0y"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
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
