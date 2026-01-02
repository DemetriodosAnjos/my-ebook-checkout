"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ShoppingBag, Ticket } from "lucide-react";
import "./SocialProof.css";

const NOMES = [
  "Mateus",
  "Pamela",
  "Rodrigo",
  "Ana",
  "Lucas",
  "Beatriz",
  "Guilherme",
  "Juliana",
  "Felipe",
  "Larissa",
];
const LOCAIS = [
  "São Paulo",
  "Rio de Janeiro",
  "Curitiba",
  "Belo Horizonte",
  "Salvador",
  "Porto Alegre",
];
// Adicionamos o "Teste de Webhook" na lista para disparar a lógica de desconto
const PLANOS = [
  "Acesso Vitalício",
  "Plano Anual",
  "Acesso Vitalício",
  "Teste de Webhook",
];

const SocialProof: React.FC = () => {
  const [stage, setStage] = useState<"hidden" | "entering" | "leaving">(
    "hidden"
  );
  const [data, setData] = useState({
    nome: "",
    plano: "",
    local: "",
    isVoucher: false,
  });

  const triggerNotification = useCallback(() => {
    const random = (arr: string[]) =>
      arr[Math.floor(Math.random() * arr.length)];

    const planoSorteado = random(PLANOS);
    const isVoucher = planoSorteado === "Teste de Webhook";

    setData({
      nome: random(NOMES),
      // Se for voucher, mudamos a frase. Se não, mantemos o padrão "Adquiriu o..."
      plano: isVoucher
        ? "Ganhou R$ 99,00 de desconto"
        : `Adquiriu o ${planoSorteado}`,
      local: random(LOCAIS),
      isVoucher,
    });

    setStage("entering");

    setTimeout(() => {
      setStage("leaving");
      setTimeout(() => setStage("hidden"), 500);
    }, 5000);
  }, []);

  useEffect(() => {
    const initialDelay = setTimeout(triggerNotification, 3000);
    const interval = setInterval(triggerNotification, 12000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [triggerNotification]);

  if (stage === "hidden") return null;

  return (
    <div
      className={`social-proof ${
        stage === "leaving" ? "social-proof--leaving" : ""
      }`}
    >
      <div className="social-proof__icon">
        {/* Trocamos o ícone dinamicamente se for um voucher */}
        {data.isVoucher ? (
          <Ticket size={18} className="text-emerald-400" />
        ) : (
          <ShoppingBag size={18} className="text-emerald-400" />
        )}
      </div>
      <div className="social-proof__content">
        <p className="social-proof__text">
          <strong>{data.nome}</strong> de {data.local}
        </p>
        <p className="social-proof__subtext">
          {/* Se for voucher, aplicamos negrito e cor para destacar a validação do Hero */}
          <span
            className={
              data.isVoucher ? "text-emerald-400 font-bold" : "text-emerald-400"
            }
          >
            {data.plano}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SocialProof;
