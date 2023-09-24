import { z } from 'zod';

const abilityScoreIncreaseZodSchema = z.object({
    name: z.string(),
    value: z.number(),
});

const characteristicsZodSchema = z.object({
    name: z.string(),
    description: z.string(),
});

const subRacesZodSchema = z.object({
    name: z.string(),
    description: z.string(),
    abilityScoreIncrease: abilityScoreIncreaseZodSchema,
    characteristics: z.array(characteristicsZodSchema),
});

const raceZodSchema = z.object({
    name: z.string(),
    description: z.string(),
    abilityScoreIncrease: abilityScoreIncreaseZodSchema,
    ageMax: z.number(),
    alignment: z.array(z.string()),
    heightMax: z.number(),
    speed: z.tuple([z.number(), z.string()]),
    language: z.array(z.string()),
    subRaces: z.array(subRacesZodSchema),
    skillProficiencies: z.array(z.string()),
    characteristics: z.array(characteristicsZodSchema),
    weightMax: z.number(),
});

export type Characteristic = z.infer<typeof characteristicsZodSchema>;
export type Race = z.infer<typeof raceZodSchema>;
export type SubRace = z.infer<typeof subRacesZodSchema>;
export type AbilityScoreIncrease = z.infer<typeof abilityScoreIncreaseZodSchema>;

export default raceZodSchema;
