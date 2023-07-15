import { z } from "zod";

const hitPointsZodSchema = z.object({
  hitDice: z.string(),
  hitPointsAtFirstLevel: z.string(),
  hitPointsAtHigherLevels: z.string(),
});

const savingThrowsZodSchema = z.object({
  name: z.string(),
  value: z.number().int(),
});

const skillProficiencesZodSchema = z.object({
  name: z.string(),
  value: z.number().int(),
});

const statsZodSchema = z.object({
  armorClass: z.number().int(),
  hitPoints: hitPointsZodSchema,
  speed: z.number().int(),
  savingThrows: z.array(savingThrowsZodSchema),
  damageImmunity: z.array(z.string()),
  statusImmunity: z.array(z.string()),
  senses: z.array(z.string()),
  skillProficiences: z.array(skillProficiencesZodSchema),
  languages: z.array(z.string()),
  challangeLevel: z.number().int(),
});

const abilityScoreZodSchema = z.object({
  name: z.string(),
  value: z.number().int(),
  modifier: z.number().int(),
});

const skillsZodSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const actionsZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  successTarget: z.string(),
});

const monsterZodSchema = z.object({
  name: z.string(),
  characteristics: z.array(z.string()),
  stats: statsZodSchema,
  abilityScore: z.array(abilityScoreZodSchema),
  skills: z.array(skillsZodSchema),
  actions: z.array(actionsZodSchema),
  picture: z.string(),
});

export type Monster = z.infer<typeof monsterZodSchema>;

export default monsterZodSchema;
