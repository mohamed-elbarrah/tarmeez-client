import { z } from "zod";

export const BenefitsSectionSchema = z.object({
  type: z.literal("benefits"),
  headline: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  benefits: z
    .array(
      z.object({
        icon: z.string().max(50).optional(),
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(300),
      })
    )
    .min(2)
    .max(8),
});

export type BenefitsSection = z.infer<typeof BenefitsSectionSchema>;
