import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { PageTransition } from "@/components/common/PageTransition";

function MainPortfolio() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Hero />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}

export default MainPortfolio;