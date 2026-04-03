import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import HowItWorks from "@/components/HowItWorks";
import MedicationDemo from "@/components/MedicationDemo";
import FeaturesChess from "@/components/FeaturesChess";
import FeaturesGrid from "@/components/FeaturesGrid";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import CtaFooter from "@/components/CtaFooter";
import FloatingCta from "@/components/FloatingCta";

const Index = () => {
  return (
    <div className="bg-background w-full overflow-clip">
      <Navbar />
      <Hero />
      <Partners />
      <HowItWorks />
      <MedicationDemo />
      <FeaturesChess />
      <FeaturesGrid />
      <Stats />
      <Testimonials />
      <CtaFooter />
      <FloatingCta />
    </div>
  );
};

export default Index;
