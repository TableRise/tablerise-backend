import { z } from 'zod';

const backgroundZodSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  bonus: z.object({
    name: z.string(),
    value: z.number()
  }),
  equipment: z.object({
    name: z.string(),
    damage: z.string()
  })
});

type IBackground = z.infer<typeof backgroundZodSchema>;

export { type IBackground, backgroundZodSchema };
