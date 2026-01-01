"use client"; // Obrigatório para usar funções de scroll e eventos de clique

import Hero from "@/components/landing/Hero";
import Pricing from "@/components/landing/Pricing";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import WhatsAppButton from "@/components/landing/WhatsAppButton";
import TargetAudience from "@/components/landing/TargetAudience";
import FAQ from "@/components/landing/FAQ";
export default function LandingPage() {
  // Função para realizar o scroll suave até a seção de preços
  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing");

    if (pricingSection) {
      // Cálculo com offset para não cobrir o título (caso tenha header fixo)
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = pricingSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <main>
      <Hero onAction={scrollToPricing} />
      <Features />
      <TargetAudience />
      <Pricing />
      <FAQ />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
