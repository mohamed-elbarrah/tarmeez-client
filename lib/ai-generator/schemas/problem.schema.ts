import { z } from "zod";

export const ProblemSectionSchema = z.object({
  type: z.literal("problem"),
  headline: z.string().min(1).max(120),
  description: z.string().min(1).max(500).optional(),
  painPoints: z
    .array(
      z.object({
        icon: z.string().max(50).optional(),
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(300),
      })
    )
    .min(1)
    .max(6),
});

export type ProblemSection = z.infer<typeof ProblemSectionSchema>;
