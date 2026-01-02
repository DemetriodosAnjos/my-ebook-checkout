"use client";

import React, { useState } from "react";
import { X, Lock, ArrowRight, Sparkles, Gift, ShieldCheck } from "lucide-react";
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

  const isTestPlan = planId === "teste";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await handlePurchase(planId, formData);
      if (result?.error) {
        alert(result.error);
        setLoading(false);
      }
    } catch (error: any) {
      if (error.message !== "NEXT_REDIRECT") {
        console.error("Erro no checkout:", error);
        alert("Ocorreu um erro inesperado. Tente novamente.");
        setLoading(false);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
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
            {/* Tag Badge Dinâmica baseada no Plano */}
            <div
              className={`modal-tag-badge ${
                isTestPlan ? "!bg-amber-500/20 !text-amber-500" : ""
              }`}
            >
              {isTestPlan ? (
                <>
                  <Gift size={14} /> GANHE R$ 99,00 OFF
                </>
              ) : planId === "vitalicio" ? (
                <>
                  <Sparkles size={14} /> MELHOR ESCOLHA
                </>
              ) : (
                <>
                  <ShieldCheck size={14} /> CHECKOUT SEGURO
                </>
              )}
            </div>

            <h2 className="modal-title">{planName}</h2>
            <p className="modal-subtitle">
              {isTestPlan
                ? "Finalize o teste de R$ 0,99 para liberar seu cupom no e-mail."
                : "Você está a um passo de garantir o controle total do seu faturamento."}
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
              {isTestPlan && (
                <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                  * Verifique seu e-mail para receber o voucher após o teste.
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp / Telefone</label>
              <input
                required
                type="tel"
                placeholder="(99) 99999-9999"
                className="form-input"
                value={formData.phone}
                onChange={handlePhoneChange}
              />
            </div>

            <button
              disabled={loading}
              className={`modal-submit-btn ${
                isTestPlan
                  ? "!bg-amber-500 !text-amber-950 hover:!bg-amber-400"
                  : ""
              }`}
            >
              {loading ? "Processando..." : `Pagar ${price}`}
              {!loading && <ArrowRight size={18} />}
            </button>

            <footer className="modal-footer">
              <Lock size={12} /> Pagamento 100% seguro via Mercado Pago.
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
