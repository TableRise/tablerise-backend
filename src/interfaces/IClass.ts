import { z } from 'zod';

const raceZodSchema = z.object({
  system_id: z.string(),
  name: z.string(),
  details: z.string(),
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
      'speed',
    ]),
    value: z.number(),
  })).optional(),
  leveling: z.array(z.object({
    level: z.number().default(0),
    proficience_bonus: z.number().default(0),
    characteristics: z.string(),
    furies: z.number().default(0).optional(),
    fury_damage: z.number().default(0).optional(),
    known_tricks: z.number().default(0).optional(),
    known_spells: z.number().default(0).optional(),
    spell_spaces: z.object({
      1: z.number().default(0),
      2: z.number().default(0),
      3: z.number().default(0),
      4: z.number().default(0),
      5: z.number().default(0),
      6: z.number().default(0),
      7: z.number().default(0),
      8: z.number().default(0),
      9: z.number().default(0),
    }).optional()
  }))
});
