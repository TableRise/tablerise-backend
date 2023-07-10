import { z } from 'zod';

const higherLevelsZodSchema = z.object({
  level: z.string(),
  damage: z.string(),
  buffs: z.array(z.string()),
  debuffs: z.array(z.string())
});

const spellZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.string(),
  level: z.string(),
  higherLevels: higherLevelsZodSchema,
  damage: z.string(),
  castingTime: z.string(),
  duration: z.string(),
  range: z.string(),
  components: z.array(z.string()),
  buffs: z.array(z.string()),
  debuffs: z.array(z.string())
});

export type Spell = z.infer<typeof spellZodSchema>;

export default spellZodSchema;
