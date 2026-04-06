import { z } from "zod";

export const TrustSectionSchema = z.object({
  type: z.literal("trust"),
  headline: z.string().min(1).max(120),
  stats: z
    .array(
      z.object({
        value: z.string().min(1).max(30),
        label: z.string().min(1).max(100),
      })
    )
    .max(6)
    .optional(),
  badges: z
    .array(
      z.object({
        icon: z.string().max(50).optional(),
        label: z.string().min(1).max(100),
      })
    )
    .max(8)
    .optional(),
  partners: z.array(z.string().max(200)).max(12).optional(),
});

export type TrustSection = z.infer<typeof TrustSectionSchema>;
