import { z } from "zod";

export const FeaturesSectionSchema = z.object({
  type: z.literal("features"),
  headline: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  features: z
    .array(
      z.object({
        icon: z.string().max(50).optional(),
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(300),
      })
    )
    .min(2)
    .max(12),
  layout: z.enum(["grid", "list", "alternating"]).default("grid"),
});

export type FeaturesSection = z.infer<typeof FeaturesSectionSchema>;
