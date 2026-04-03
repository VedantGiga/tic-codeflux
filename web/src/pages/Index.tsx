import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import HowItWorks from "@/components/HowItWorks";
import MedicationDemo from "@/components/MedicationDemo";
import FeaturesChess from "@/components/FeaturesChess";
import FeaturesGrid from "@/components/FeaturesGrid";
import Timeline from "@/components/Timeline";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/FaqSection";
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
      <Timeline />
      <Stats />
      <Testimonials />
      <FaqSection />
      <FloatingCta />
    </div>
  );
};

export default Index;
