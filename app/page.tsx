import FeaturesSection from "@/components/features-section";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";
import MultiStoreFeatures from "@/components/multi-store-features";


export default function Home() {
  return (
    <main>
      <HeroHeader />
      <HeroSection />
      <FeaturesSection />
      <MultiStoreFeatures />

    </main>
  );
}
