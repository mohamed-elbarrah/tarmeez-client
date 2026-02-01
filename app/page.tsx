import FeaturesSection from "@/components/features-section";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";
import MultiStoreFeatures from "@/components/multi-store-features";
import ProcessSteps from "@/components/process-steps";


export default function Home() {
  return (
    <main>
      <HeroHeader />
      <HeroSection />
      <FeaturesSection />
      <MultiStoreFeatures />
      <ProcessSteps />

    </main>
  );
}
