import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ProductSection } from "@/components/landing/ProductSection";
import { DemoCTA } from "@/components/landing/DemoCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="bg-paper">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
      <Hero />
      <ProblemSection />
      <ProductSection />
      <DemoCTA />
      </main>
      <Footer />
    </div>
  );
}
