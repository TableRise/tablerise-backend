import { z } from 'zod';

const systemZodSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  reference: z.string(),
  rule_ids: z.object({
    race: z.array(z.string().length(24)),
    class: z.array(z.string().length(24)),
    items: z.array(z.string().length(24)),
    attacks: z.array(z.string().length(24)),
    background: z.array(z.string().length(24))
  }),
  details: z.string()
});

type ISystem = z.infer<typeof systemZodSchema>;

export { type ISystem, systemZodSchema }
