import { z } from "zod";

export const OfferSectionSchema = z.object({
  type: z.literal("offer"),
  headline: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  price: z.string().min(1).max(50),
  originalPrice: z.string().max(50).optional(),
  currency: z.string().max(10).default("SAR"),
  ctaText: z.string().min(1).max(50),
  urgencyText: z.string().max(200).optional(),
  bulletPoints: z.array(z.string().max(200)).max(10).optional(),
});

export type OfferSection = z.infer<typeof OfferSectionSchema>;
