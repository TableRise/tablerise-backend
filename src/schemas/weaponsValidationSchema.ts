import { z } from 'zod';

const costZodSchema = z.object({
  currency: z.string(),
  value: z.number()
});

const weaponsZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  cost: costZodSchema,
  type: z.string(),
  weight: z.number(),
  damage: z.string(),
  properties: z.array(z.string())
});

export type Weapon = z.infer<typeof weaponsZodSchema>;
export type Cost = z.infer<typeof costZodSchema>;

export default weaponsZodSchema;
