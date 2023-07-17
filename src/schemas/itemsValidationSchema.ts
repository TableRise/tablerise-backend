import { z } from 'zod';

const itemsZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  cost: z.number(),
  type: z.string(),
  weight: z.number()
});

export type Item = z.infer<typeof itemsZodSchema>;

export default itemsZodSchema;
