import z from 'zod';

const abilityModifierZodSchema = z.object({
  name: z.string(), // str, dex, vit, int, wix, char
  value: z.number().int()
})

const characteristicsZodSchema = z.object({
  name: z.string(),
  description: z.string()
})

const subRacesZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  abilityScoreIncrease: abilityModifierZodSchema
})

const racesZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  abilityScoreIncrease: abilityModifierZodSchema,
  age: z.number().int(),
  alignment: z.array(z.string()),
  height: z.number().int(),
  speed: z.number().int(),
  language: z.array(z.string()),
  subRaces: z.array(subRacesZodSchema),
  skillProficiences: z.array(z.string()),
  characterstics: z.array(characteristicsZodSchema)
});

export type Characteristic = z.infer<typeof characteristicsZodSchema>
export type Race = z.infer<typeof racesZodSchema>
export type SubRace = z.infer<typeof subRacesZodSchema>
export type AbilityModifier = z.infer<typeof abilityModifierZodSchema>

export default racesZodSchema;
