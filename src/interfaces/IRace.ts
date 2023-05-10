import { z } from 'zod';

const raceZodSchema = z.object({
  system_id: z.string(),
  name: z.string(),
  details: z.string(),
  sub_race: z.string().optional(),
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
  characteristics: z.string(),
});

type IRace = z.infer<typeof raceZodSchema>;

export { IRace, raceZodSchema };
