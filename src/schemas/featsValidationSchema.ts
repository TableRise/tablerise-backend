import { z } from 'zod';

const featZodSchema = z.object({
  name: z.string(),
  prerequisite: z.string(),
  description: z.string(),
  benefits: z.array(z.string())
});

export type Feat = z.infer<typeof featZodSchema>;

export default featZodSchema;
