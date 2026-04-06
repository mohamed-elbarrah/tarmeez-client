import { z } from "zod";

export const TestimonialsSectionSchema = z.object({
  type: z.literal("testimonials"),
  headline: z.string().min(1).max(120),
  testimonials: z
    .array(
      z.object({
        quote: z.string().min(1).max(500),
        authorName: z.string().min(1).max(100),
        authorTitle: z.string().max(100).optional(),
        rating: z.number().int().min(1).max(5).optional(),
      })
    )
    .min(1)
    .max(12),
  layout: z.enum(["grid", "carousel", "stacked"]).default("carousel"),
});

export type TestimonialsSection = z.infer<typeof TestimonialsSectionSchema>;
