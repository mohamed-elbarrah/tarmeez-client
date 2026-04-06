import React from "react";
import type {
  LandingPageContent,
  LandingSection,
} from "@/lib/ai-generator/schemas";

import { HeroSectionBlock } from "../components/ai-sections/HeroSection";
import { ProblemSectionBlock } from "../components/ai-sections/ProblemSection";
import { SolutionSectionBlock } from "../components/ai-sections/SolutionSection";
import { FeaturesSectionBlock } from "../components/ai-sections/FeaturesSection";
import { BenefitsSectionBlock } from "../components/ai-sections/BenefitsSection";
import { GallerySectionBlock } from "../components/ai-sections/GallerySection";
import { UseCasesSectionBlock } from "../components/ai-sections/UseCasesSection";
import { ComparisonSectionBlock } from "../components/ai-sections/ComparisonSection";
import { TrustSectionBlock } from "../components/ai-sections/TrustSection";
import { TestimonialsSectionBlock } from "../components/ai-sections/TestimonialsSection";
import {
  OfferSectionBlock,
  FinalCtaSectionBlock,
} from "../components/ai-sections/CtaSection";
import { FaqSectionBlock } from "../components/ai-sections/FaqSection";

function renderSection(
  section: LandingSection,
  index: number,
): React.ReactNode {
  switch (section.type) {
    case "hero":
      return <HeroSectionBlock key={index} {...section} />;
    case "problem":
      return <ProblemSectionBlock key={index} {...section} />;
    case "solution":
      return <SolutionSectionBlock key={index} {...section} />;
    case "features":
      return <FeaturesSectionBlock key={index} {...section} />;
    case "benefits":
      return <BenefitsSectionBlock key={index} {...section} />;
    case "gallery":
      return <GallerySectionBlock key={index} {...section} />;
    case "useCases":
      return <UseCasesSectionBlock key={index} {...section} />;
    case "comparison":
      return <ComparisonSectionBlock key={index} {...section} />;
    case "trust":
      return <TrustSectionBlock key={index} {...section} />;
    case "testimonials":
      return <TestimonialsSectionBlock key={index} {...section} />;
    case "offer":
      return <OfferSectionBlock key={index} {...section} />;
    case "faq":
      return <FaqSectionBlock key={index} {...section} />;
    case "finalCta":
      return <FinalCtaSectionBlock key={index} {...section} />;
    default:
      return null;
  }
}

interface AIPageRendererProps {
  content: LandingPageContent;
}

export function AIPageRenderer({ content }: AIPageRendererProps) {
  const { sections } = content;

  return (
    <div className="ai-landing-page" dir="rtl">
      {sections.map((section, i) => renderSection(section, i))}
    </div>
  );
}
