import { z } from "zod";

export const GallerySectionSchema = z.object({
  type: z.literal("gallery"),
  headline: z.string().min(1).max(120),
  description: z.string().max(300).optional(),
  images: z
    .array(
      z.object({
        src: z.string().min(1).max(500),
        alt: z.string().min(1).max(200),
        caption: z.string().max(200).optional(),
      })
    )
    .min(1)
    .max(20),
  layout: z.enum(["grid", "carousel", "masonry"]).default("grid"),
});

export type GallerySection = z.infer<typeof GallerySectionSchema>;
