import { z } from "zod";

export const UseCasesSectionSchema = z.object({
  type: z.literal("useCases"),
  headline: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  cases: z
    .array(
      z.object({
        icon: z.string().max(50).optional(),
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(400),
        persona: z.string().max(100).optional(),
      })
    )
    .min(2)
    .max(8),
});

export type UseCasesSection = z.infer<typeof UseCasesSectionSchema>;
