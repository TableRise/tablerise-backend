import { z } from 'zod';

const subTopicsZodSchema = z.object({
  subTitle: z.string(),
  description: z.string()
})

const wikiZodSchema = z.object({
  title: z.string(),
  description: z.string(),
  reference: z.string(),
  image: z.string(),
  subTopics: z.array(subTopicsZodSchema)
});

export type Wiki = z.infer<typeof wikiZodSchema>;

export default wikiZodSchema;
