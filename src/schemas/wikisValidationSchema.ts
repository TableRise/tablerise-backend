import { z } from 'zod';

const wikiZodSchema = z.object({
  title: z.string(),
  description: z.string(),
  reference: z.string(),
  image: z.string()
});

export type Wiki = z.infer<typeof wikiZodSchema>;

export default wikiZodSchema;
