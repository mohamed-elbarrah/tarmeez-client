import { z } from "zod";

export const ComparisonSectionSchema = z.object({
  type: z.literal("comparison"),
  headline: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  mode: z
    .enum(["before_after", "vs_competitor", "table"])
    .default("before_after"),
  items: z
    .array(
      z.object({
        label: z.string().min(1).max(100),
        before: z.string().min(1).max(200),
        after: z.string().min(1).max(200),
      }),
    )
    .min(2)
    .max(10),
});

export type ComparisonSection = z.infer<typeof ComparisonSectionSchema>;
