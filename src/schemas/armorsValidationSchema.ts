import { z } from 'zod';

const costZodSchema = z.object({
  currency: z.string(),
  value: z.number()
});

const armorsZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  cost: costZodSchema,
  type: z.string(),
  weight: z.number(),
  armorClass: z.number(),
  requiredStrength: z.number(),
  stealthPenalty: z.boolean()
});

export type Armor = z.infer<typeof armorsZodSchema>;

export default armorsZodSchema;
