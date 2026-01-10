import { HeroLanding } from "@/components/ui/hero-landing";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroLanding />
      <Footer />
    </div>
  );
};

export default Index;
