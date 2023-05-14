import { z } from 'zod';

const raceZodSchema = z.object({
  name: z.string(),
  details: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
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
  sub_race: z.array(z.object({
    name: z.string(),
    details: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
  })).optional(),
});

type IRace = z.infer<typeof raceZodSchema>;

export { IRace, raceZodSchema };
