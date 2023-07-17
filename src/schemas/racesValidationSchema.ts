import { z } from 'zod';

const abilityScoreIncreaseZodSchema = z.object({
  name: z.string(),
  value: z.number().int()
})

const characteristicsZodSchema = z.object({
  name: z.string(),
  description: z.string()
})

const subRacesZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  abilityScoreIncrease: abilityScoreIncreaseZodSchema,
  characteristics: z.array(characteristicsZodSchema)
})

const racesZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  abilityScoreIncrease: abilityScoreIncreaseZodSchema,
  ageMax: z.number().int(),
  alignment: z.array(z.string()),
  heightMax: z.number().int(),
  speed: z.tuple([z.number(), z.string()]),
  language: z.array(z.string()),
  subRaces: z.array(subRacesZodSchema),
  skillProficiences: z.array(z.string()),
  characterstics: z.array(characteristicsZodSchema),
  weightMax: z.number()
});

export type Characteristic = z.infer<typeof characteristicsZodSchema>
export type Race = z.infer<typeof racesZodSchema>
export type SubRace = z.infer<typeof subRacesZodSchema>
export type AbilityScoreIncrease = z.infer<typeof abilityScoreIncreaseZodSchema>

export default racesZodSchema;
