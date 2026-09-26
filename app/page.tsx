"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ScrollStory } from "@/components/landing/ScrollStory";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ProductSection } from "@/components/landing/ProductSection";
import { DemoCTA } from "@/components/landing/DemoCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="bg-paper">
      <a className="skip-link" href="#main">{t("Skip to content", "Ir al contenido")}</a>
      <Header />
      <main id="main">
      <Hero />
      <ScrollStory />
      <ProblemSection />
      <ProductSection />
      <DemoCTA />
      </main>
      <Footer />
    </div>
  );
}
