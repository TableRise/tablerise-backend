import { z } from 'zod';

const systemZodSchema = z.object({
  name: z.string(),
  reference: z.string(),
  rule_ids: z.object({
    race: z.array(z.string().length(16)),
    class: z.array(z.string().length(16)),
    items: z.array(z.string().length(16)),
    attacks: z.array(z.string().length(16)),
    background: z.array(z.string().length(16)),
  }),
  details: z.string(),
});

type ISystem = z.infer<typeof systemZodSchema>;

export { ISystem, systemZodSchema }
