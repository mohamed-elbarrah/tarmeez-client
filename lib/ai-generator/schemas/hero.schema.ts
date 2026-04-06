import { z } from "zod";

export const HeroSectionSchema = z.object({
  type: z.literal("hero"),
  headline: z.string().min(1).max(120),
  subheadline: z.string().min(1).max(300),
  ctaText: z.string().min(1).max(50),
  ctaUrl: z.string().optional(),
  backgroundStyle: z.enum(["image", "gradient", "solid"]).default("gradient"),
  alignment: z.enum(["center", "right", "left"]).default("center"),
  badgeText: z.string().max(60).optional(),
});

export type HeroSection = z.infer<typeof HeroSectionSchema>;
