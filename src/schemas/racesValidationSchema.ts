import z from 'zod';

const abilityModifierZodSchema = z.object({
  name: z.string(), // str, dex, vit, int, wix, char
  value: z.number().int()
})

const characteristicsZodSchema = z.object({
  name: z.string(),
  descrition: z.string()
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
  alignment: z.array(subRacesZodSchema),
  height: z.number().int(),
  speed: z.number().int(),
  language: z.array(z.string()),
  subRaces: z.array(subRacesZodSchema),
  skillProficiences: z.string().array(),
  characterstics: z.array(characteristicsZodSchema)
});

export type Characteristics = z.infer<typeof characteristicsZodSchema>
export type Race = z.infer<typeof racesZodSchema>
export type SubRaces = z.infer<typeof subRacesZodSchema>

export default racesZodSchema;
