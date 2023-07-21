import { z } from 'zod';

const systemReferencesZodSchema = z.object({
  srd: z.string(),
  icon: z.string(),
  cover: z.string()
});

const systemContentZodSchema = z.object({
  races: z.array(z.string().length(24)),
  classes: z.array(z.string().length(24)),
  spells: z.array(z.string().length(24)),
  items: z.array(z.string().length(24)),
  weapons: z.array(z.string().length(24)),
  armors: z.array(z.string().length(24)),
  feats: z.array(z.string().length(24)),
  realms: z.array(z.string().length(24)),
  gods: z.array(z.string().length(24)),
  monsters: z.array(z.string().length(24))
});

const systemZodSchema = z.object({
  name: z.string(),
  content: systemContentZodSchema,
  references: systemReferencesZodSchema,
  active: z.boolean().default(true)
});

export type System = z.infer<typeof systemZodSchema> & { _id?: string }
export type SystemContent = z.infer<typeof systemContentZodSchema>
export type SystemReference = z.infer<typeof systemReferencesZodSchema>

export default systemZodSchema;
