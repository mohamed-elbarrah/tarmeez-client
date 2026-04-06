import { z } from "zod";

export const FaqSectionSchema = z.object({
  type: z.literal("faq"),
  headline: z.string().min(1).max(120),
  description: z.string().max(300).optional(),
  questions: z
    .array(
      z.object({
        question: z.string().min(1).max(300),
        answer: z.string().min(1).max(1000),
      }),
    )
    .min(2)
    .max(20),
});

export type FaqSection = z.infer<typeof FaqSectionSchema>;
