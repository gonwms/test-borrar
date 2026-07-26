import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z
      .union([z.string(), z.date()])
      .transform((val) => {
        if (val instanceof Date) {
          return new Date(Date.UTC(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate(), 12, 0, 0));
        }
        return new Date(val + "T12:00:00");
      }),
    category: z.enum(["politica", "economia"]),
    author: z.string(),
    status: z.enum(["published", "draft"]).default("draft"),
  }),
});

export const collections = { blog };
