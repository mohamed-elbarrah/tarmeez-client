import { z } from "zod";

export const FinalCtaSectionSchema = z.object({
  type: z.literal("finalCta"),
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(300).optional(),
  ctaText: z.string().min(1).max(50),
  ctaUrl: z.string().optional(),
  guaranteeText: z.string().max(300).optional(),
});

export type FinalCtaSection = z.infer<typeof FinalCtaSectionSchema>;
