"use client";

import React, { useState } from "react";
import { X, Lock, ArrowRight, Sparkles } from "lucide-react"; // Importado Sparkles
import { handlePurchase } from "./checkoutBack";
import "./CheckoutModal.css";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  price: string;
}

const CheckoutModal = ({
  isOpen,
  onClose,
  planId,
  planName,
  price,
}: CheckoutModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chamamos a Action.
      // Se der sucesso, o Next.js fará o redirect automaticamente.
      const result = await handlePurchase(planId, formData);

      // Se a Action retornou um objeto com erro (em vez de redirecionar)
      if (result?.error) {
        alert(result.error);
        setLoading(false);
      }
    } catch (error: any) {
      // IMPORTANTE: Não interrompa o redirecionamento!
      // O Next.js usa erros para redirecionar em Server Actions.
      // Só tratamos erros que não sejam de redirecionamento.
      if (error.message !== "NEXT_REDIRECT") {
        console.error("Erro no checkout:", error);
        alert("Ocorreu um erro inesperado. Tente novamente.");
        setLoading(false);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que NÃO for número
    const value = e.target.value.replace(/\D/g, "");

    // Limita a 11 dígitos (DDD + 9 + 8 dígitos)
    if (value.length <= 11) {
      setFormData({ ...formData, phone: value });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header-actions">
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <header className="modal-header">
            {/* Tag Badge Consistente com o Pricing */}
            <div className="modal-tag-badge">
              <Sparkles size={14} />
              {planId === "vitalicio" ? "MELHOR ESCOLHA" : "CHECKOUT SEGURO"}
            </div>

            <h2 className="modal-title">{planName}</h2>
            <p className="modal-subtitle">
              Economize semanas de trabalho configurando infraestrutura.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input
                required
                type="text"
                placeholder="Ex: João Silva"
                className="form-input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">E-mail de Acesso</label>
              <input
                required
                type="email"
                placeholder="joao@exemplo.com"
                className="form-input"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp / Telefone</label>
              <input
                required
                type="tel"
                placeholder="(99) 99999-9999"
                className="form-input"
                value={formData.phone}
                onChange={handlePhoneChange} // Usa a função de filtro
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Digite apenas os números com DDD
              </span>
            </div>

            <button disabled={loading} className="modal-submit-btn">
              {loading ? "Processando..." : `Pagar ${price}`}
              {!loading && <ArrowRight size={18} />}
            </button>

            <footer className="modal-footer">
              <Lock size={12} /> Pagamento processado via Mercado Pago.
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
