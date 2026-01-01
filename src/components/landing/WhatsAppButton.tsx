"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import "./WhatsAppButton.css";

const WhatsAppButton: React.FC = () => {
  const phone = "5541999999999"; // Substitua pelo seu número real
  const message = "Olá! Tenho uma dúvida sobre o Boilerplate SaaS.";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle size={30} fill="currentColor" />
      <span className="whatsapp-float__tooltip">Dúvidas? Fale comigo</span>
    </a>
  );
};

export default WhatsAppButton;
