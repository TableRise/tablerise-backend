import { z } from 'zod';

const systemZodSchema = z.object({
  name: z.string(),
  reference: z.string(),
  rules_id: z.string().length(16),
  details: z.string(),
});

type ISystem = z.infer<typeof systemZodSchema>;

export { ISystem, systemZodSchema }
