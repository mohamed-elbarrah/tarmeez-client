import { z } from "zod";

import { HeroSectionSchema } from "./hero.schema";
import { ProblemSectionSchema } from "./problem.schema";
import { SolutionSectionSchema } from "./solution.schema";
import { FeaturesSectionSchema } from "./features.schema";
import { BenefitsSectionSchema } from "./benefits.schema";
import { GallerySectionSchema } from "./gallery.schema";
import { UseCasesSectionSchema } from "./use-cases.schema";
import { ComparisonSectionSchema } from "./comparison.schema";
import { TrustSectionSchema } from "./trust.schema";
import { TestimonialsSectionSchema } from "./testimonials.schema";
import { OfferSectionSchema } from "./offer.schema";
import { FaqSectionSchema } from "./faq.schema";
import { FinalCtaSectionSchema } from "./final-cta.schema";

// ─── Discriminated Union of All Sections ─────────────────────
export const LandingSectionSchema = z.discriminatedUnion("type", [
  HeroSectionSchema,
  ProblemSectionSchema,
  SolutionSectionSchema,
  FeaturesSectionSchema,
  BenefitsSectionSchema,
  GallerySectionSchema,
  UseCasesSectionSchema,
  ComparisonSectionSchema,
  TrustSectionSchema,
  TestimonialsSectionSchema,
  OfferSectionSchema,
  FaqSectionSchema,
  FinalCtaSectionSchema,
]);

export type LandingSection = z.infer<typeof LandingSectionSchema>;

// ─── Full Landing Page Content Schema ────────────────────────
export const LandingPageContentSchema = z.object({
  sections: z.array(LandingSectionSchema).min(1).max(13),
  metadata: z.object({
    language: z.enum(["ar", "en"]).default("ar"),
    tone: z.enum(["professional", "casual", "luxurious", "playful", "urgent"]).default("professional"),
    colorScheme: z.string().max(50).optional(),
  }),
});

export type LandingPageContent = z.infer<typeof LandingPageContentSchema>;

// ─── Canonical Section Order ─────────────────────────────────
export const CANONICAL_SECTION_ORDER = [
  "hero",
  "problem",
  "solution",
  "features",
  "benefits",
  "gallery",
  "useCases",
  "comparison",
  "trust",
  "testimonials",
  "offer",
  "faq",
  "finalCta",
] as const;

export type SectionType = (typeof CANONICAL_SECTION_ORDER)[number];

// ─── Re-exports ──────────────────────────────────────────────
export { HeroSectionSchema } from "./hero.schema";
export { ProblemSectionSchema } from "./problem.schema";
export { SolutionSectionSchema } from "./solution.schema";
export { FeaturesSectionSchema } from "./features.schema";
export { BenefitsSectionSchema } from "./benefits.schema";
export { GallerySectionSchema } from "./gallery.schema";
export { UseCasesSectionSchema } from "./use-cases.schema";
export { ComparisonSectionSchema } from "./comparison.schema";
export { TrustSectionSchema } from "./trust.schema";
export { TestimonialsSectionSchema } from "./testimonials.schema";
export { OfferSectionSchema } from "./offer.schema";
export { FaqSectionSchema } from "./faq.schema";
export { FinalCtaSectionSchema } from "./final-cta.schema";

export type { HeroSection } from "./hero.schema";
export type { ProblemSection } from "./problem.schema";
export type { SolutionSection } from "./solution.schema";
export type { FeaturesSection } from "./features.schema";
export type { BenefitsSection } from "./benefits.schema";
export type { GallerySection } from "./gallery.schema";
export type { UseCasesSection } from "./use-cases.schema";
export type { ComparisonSection } from "./comparison.schema";
export type { TrustSection } from "./trust.schema";
export type { TestimonialsSection } from "./testimonials.schema";
export type { OfferSection } from "./offer.schema";
export type { FaqSection } from "./faq.schema";
export type { FinalCtaSection } from "./final-cta.schema";
