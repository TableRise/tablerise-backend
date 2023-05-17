import { z } from 'zod';

const classZodSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  details: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).optional(),
  bonus: z.array(z.object({
    name: z.enum([
      'strength',
      'dexterity',
      'constitution',
      'intelligence',
      'wisdom',
      'charisma',
      'hit-points',
      'class-armor',
      'initiative',
      'proficience_bonus',
      'speed'
    ]),
    value: z.number()
  })).optional(),
  leveling: z.array(z.object({
    level: z.number().default(0),
    proficience_bonus: z.number().default(0),
    characteristics: z.array(z.string()),
    furies: z.number().default(0).optional(),
    fury_damage: z.number().default(0).optional(),
    known_tricks: z.number().default(0).optional(),
    known_spells: z.number().default(0).optional(),
    spell_spaces: z.array(z.object({
      spell_level: z.number().default(0),
      amount: z.number().default(0)
    })).optional()
  }))
});

type IClass = z.infer<typeof classZodSchema>;

export { type IClass, classZodSchema }
