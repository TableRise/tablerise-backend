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
    challangeLevel: z.number(),
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

export type Monster = z.infer<typeof monsterZodSchema>;

export default monsterZodSchema;
