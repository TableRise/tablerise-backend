import { z } from 'zod';

const hitPointsZodSchema = z.object({
    hitDice: z.string(),
    default: z.number(),
});

const savingThrowsZodSchema = z.object({
    name: z.string(),
    value: z.number(),
});

const statsZodSchema = z.object({
    armorClass: z.number(),
    hitPoints: hitPointsZodSchema,
    speed: z.string(),
    savingThrows: z.array(savingThrowsZodSchema),
    damageImmunities: z.array(z.string()),
    conditionImmunities: z.array(z.string()),
    damageResistances: z.array(z.string()),
    senses: z.array(z.string()),
    languages: z.array(z.string()),
    challengeLevel: z.number(),
});

const abilityScoreZodSchema = z.object({
    name: z.string(),
    value: z.number(),
    modifier: z.number(),
});

const skillsZodSchema = z.object({
    name: z.string(),
    description: z.string(),
});

const actionsZodSchema = z.object({
    name: z.string(),
    description: z.string(),
    type: z.string(),
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

export type HitPoints = z.infer<typeof hitPointsZodSchema>;
export type SavingThrows = z.infer<typeof savingThrowsZodSchema>;
export type Stats = z.infer<typeof statsZodSchema>;
export type AbilityScore = z.infer<typeof abilityScoreZodSchema>;
export type Skills = z.infer<typeof skillsZodSchema>;
export type Actions = z.infer<typeof actionsZodSchema>;
export type Monster = z.infer<typeof monsterZodSchema>;

export default monsterZodSchema;
