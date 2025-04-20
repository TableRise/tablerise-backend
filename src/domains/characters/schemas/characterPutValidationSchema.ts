import { z } from 'zod';

const appearanceCharacterZodSchema = z.object({
    eyes: z.string().optional(),
    age: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
    skin: z.string().optional(),
    hair: z.string().optional(),
});

const otherCharacterZodSchema = z.object({
    languages: z.array(z.string()).optional(),
    proficiencies: z.string().optional(),
    extraCharacteristics: z.string().optional(),
});

const characteristicsCharacterZodSchema = z.object({
    alignment: z.string().optional(),
    backstory: z.string().optional(),
    personalityTraits: z.string().optional(),
    ideals: z.string().optional(),
    bonds: z.string().optional(),
    flaws: z.string().optional(),
    appearance: appearanceCharacterZodSchema,
    other: otherCharacterZodSchema,
});

const profileCharacterZodSchema = z.object({
    name: z.string().optional(),
    class: z.string().optional(),
    race: z.string().optional(),
    level: z.number().default(0).optional(),
    xp: z.number().default(0).optional(),
    characteristics: characteristicsCharacterZodSchema.optional(),
});

const hitPointsCharacterZodSchema = z.object({
    points: z.number().optional(),
    currentPoints: z.number().optional(),
    tempPoints: z.number().optional(),
    dicePoints: z.string().optional(),
});

const deathSavesCharacterZodSchema = z.object({
    success: z.number().optional(),
    failures: z.number().optional(),
});

const spellCastingCharacterZodSchema = z.object({
    class: z.string().optional(),
    ability: z.string().optional(),
    saveDc: z.number().optional(),
    attackBonus: z.number().optional(),
});

const statsCharacterZodSchema = z.object({
    proficiencyBonus: z.number().optional(),
    inspiration: z.number().optional(),
    passiveWisdom: z.number().optional(),
    speed: z.number().optional(),
    initiative: z.number().optional(),
    armorClass: z.number().optional(),
    hitPoints: hitPointsCharacterZodSchema,
    deathSaves: deathSavesCharacterZodSchema,
    spellCasting: spellCastingCharacterZodSchema,
});

const moneyCharacterZodSchema = z.object({
    cp: z.number().optional(),
    sp: z.number().optional(),
    ep: z.number().optional(),
    gp: z.number().optional(),
    pp: z.number().optional(),
});

const dataCharacterZodSchema = z.object({
    profile: profileCharacterZodSchema.optional(),
    stats: statsCharacterZodSchema.optional(),
    money: moneyCharacterZodSchema.optional(),
});

const updateCharacterZodSchema = z.object({
    data: dataCharacterZodSchema,
});

export default updateCharacterZodSchema;
export type UpdateCharacter = z.infer<typeof updateCharacterZodSchema>;
