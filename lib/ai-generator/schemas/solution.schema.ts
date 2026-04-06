import { z } from "zod";

export const SolutionSectionSchema = z.object({
  type: z.literal("solution"),
  headline: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  points: z
    .array(
      z.object({
        icon: z.string().max(50).optional(),
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(300),
      })
    )
    .min(1)
    .max(6),
  ctaText: z.string().max(50).optional(),
});

export type SolutionSection = z.infer<typeof SolutionSectionSchema>;
