import { z } from 'zod';
import { imageObjectZodSchema } from 'src/domains/common/schemas/commonValidationSchema';
import { Author } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { Logs } from '@tablerise/database-management/dist/src/interfaces/Common';

const alliesAndOrgsCharacterZodSchema = z.object({
    orgName: z.string(),
    symbol: imageObjectZodSchema.optional().nullable(),
    content: z.string(),
});

const appearanceCharacterZodSchema = z.object({
    eyes: z.string(),
    age: z.string(),
    weight: z.string(),
    height: z.string(),
    skin: z.string(),
    hair: z.string(),
    picture: imageObjectZodSchema.optional().nullable(),
});

const otherCharacterZodSchema = z.object({
    languages: z.array(z.string()),
    proficiencies: z.string(),
    extraCharacteristics: z.string(),
});

const characteristicsCharacterZodSchema = z.object({
    alignment: z.string(),
    backstory: z.string(),
    personalityTraits: z.string(),
    ideals: z.string(),
    bonds: z.string(),
    flaws: z.string(),
    appearance: appearanceCharacterZodSchema,
    alliesAndOrgs: z.array(alliesAndOrgsCharacterZodSchema),
    other: otherCharacterZodSchema,
    treasure: z.array(z.string()),
});

const profileCharacterZodSchema = z.object({
    name: z.string(),
    class: z.string(),
    race: z.string(),
    level: z.number().default(0).optional(),
    xp: z.number().default(0).optional(),
    characteristics: characteristicsCharacterZodSchema,
});

const abilityScoresZodSchema = z.object({
    ability: z.string(),
    value: z.number(),
    modifier: z.number(),
    proficiency: z.boolean().default(false),
});

const hitPointsCharacterZodSchema = z.object({
    points: z.number(),
    currentPoints: z.number(),
    tempPoints: z.number(),
    dicePoints: z.string(),
});

const deathSavesCharacterZodSchema = z.object({
    success: z.number(),
    failures: z.number(),
});

const spellCastingCharacterZodSchema = z.object({
    class: z.string(),
    ability: z.string(),
    saveDc: z.number(),
    attackBonus: z.number(),
});

const statsCharacterZodSchema = z.object({
    abilityScores: z.array(abilityScoresZodSchema).optional(),
    skills: z.record(z.string(), z.number()).optional(),
    proficiencyBonus: z.number(),
    inspiration: z.number(),
    passiveWisdom: z.number(),
    speed: z.number(),
    initiative: z.number(),
    armorClass: z.number(),
    hitPoints: hitPointsCharacterZodSchema,
    deathSaves: deathSavesCharacterZodSchema.optional(),
    spellCasting: spellCastingCharacterZodSchema,
});

const damageAttacksCharacterZodSchema = z.object({
    type: z.string(),
    bonus: z.number(),
    dice: z.string(),
});

const attacksCharacterZodSchema = z.object({
    name: z.string(),
    atkBonus: z.number(),
    damage: z.array(damageAttacksCharacterZodSchema),
});

const moneyCharacterZodSchema = z.object({
    cp: z.number(),
    sp: z.number(),
    ep: z.number(),
    gp: z.number(),
    pp: z.number(),
});

const spellLevelCharacterZodSchema = z.object({
    spellIds: z.array(z.string()),
    slotsTotal: z.number(),
    slotsExpended: z.number(),
});

const spellsCharacterZodSchema = z.object({
    cantrips: z.array(z.string()),
    1: spellLevelCharacterZodSchema,
    2: spellLevelCharacterZodSchema,
    3: spellLevelCharacterZodSchema,
    4: spellLevelCharacterZodSchema,
    5: spellLevelCharacterZodSchema,
    6: spellLevelCharacterZodSchema,
    7: spellLevelCharacterZodSchema,
    8: spellLevelCharacterZodSchema,
    9: spellLevelCharacterZodSchema,
});

const dataCharacterZodSchema = z.object({
    profile: profileCharacterZodSchema,
    stats: statsCharacterZodSchema,
    attacks: z.array(attacksCharacterZodSchema),
    equipments: z.array(z.string()),
    money: moneyCharacterZodSchema.optional(),
    features: z.array(z.string()),
    spells: spellsCharacterZodSchema.optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

const characterPostZodSchema = z.object({
    data: dataCharacterZodSchema,
    NPC: z.boolean(),
    picture: imageObjectZodSchema.optional().nullable(),
});

export type CharacterPayload = z.infer<typeof characterPostZodSchema>;
export type CharacterInstance = z.infer<typeof characterPostZodSchema> & {
    characterId?: string;
    campaignId?: string;
    matchId?: string;
    author: Author;
    logs: Logs[];
    createdAt?: string;
    updatedAt?: string;
};

export default characterPostZodSchema;
