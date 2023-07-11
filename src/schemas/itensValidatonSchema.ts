import { z } from 'zod';

const itensZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  cost: z.number().int(),
  type: z.string(),
  weight: z.number().int()
});

export type Item = z.infer<typeof itensZodSchema>;

export default itensZodSchema;
