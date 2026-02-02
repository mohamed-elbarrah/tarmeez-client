import CallToAction from "@/components/call-to-action";
import FeaturesSection from "@/components/features-section";
import FooterSection from "@/components/footer-section";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";
import MultiStoreFeatures from "@/components/multi-store-features";
import Pricing from "@/components/pricing";
import ProcessSteps from "@/components/process-steps";


export default function Home() {
  return (
    <main>
      <HeroHeader />
      <HeroSection />
      <FeaturesSection />
      <MultiStoreFeatures />
      <ProcessSteps />
      <Pricing />
      <CallToAction />
      <FooterSection />
    </main>
  
  );
}
