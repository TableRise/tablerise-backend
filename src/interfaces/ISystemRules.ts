import { z } from 'zod';

const systemRulesZodSchema = z.object({
  system_id: z.string(),
  races: z.array(z.string().length(16)),
  classes: z.array(z.string().length(16)),
  items: z.array(z.string().length(16)),
  attacks: z.array(z.string().length(16)),
});

type ISystemRules = z.infer<typeof systemRulesZodSchema>;

export { ISystemRules, systemRulesZodSchema }
