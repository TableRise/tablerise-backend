import { z } from 'zod';
import { ICharactersSchemas } from 'src/types/modules/interface/characters/presentation/characters/CharactersSchemas';

// ─── POST (create) ────────────────────────────────────────────────────────────

const appearanceCharacterZodSchema = z.object({
    eyes: z.string(),
    age: z.string(),
    weight: z.string(),
    height: z.string(),
    skin: z.string(),
    hair: z.string(),
});

const otherCharacterZodSchema = z.object({
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
    alliesAndOrgs: z.string(),
    other: otherCharacterZodSchema,
    treasure: z.string(),
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

const attacksCharacterZodSchema = z.object({
    name: z.string(),
    atkBonus: z.string(),
    damage: z.string(),
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
    equipments: z.string(),
    money: moneyCharacterZodSchema.optional(),
    features: z.string(),
    spells: spellsCharacterZodSchema.optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

const characterPostZodSchema = z.object({
    data: dataCharacterZodSchema,
    npc: z.boolean().default(false),
});

// ─── PUT (update) ─────────────────────────────────────────────────────────────

const appearanceUpdateZodSchema = z.object({
    eyes: z.string().optional(),
    age: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
    skin: z.string().optional(),
    hair: z.string().optional(),
});

const otherUpdateZodSchema = z.object({
    languages: z.array(z.string()).optional(),
    proficiencies: z.string().optional(),
    extraCharacteristics: z.string().optional(),
});

const characteristicsUpdateZodSchema = z.object({
    alignment: z.string().optional(),
    backstory: z.string().optional(),
    personalityTraits: z.string().optional(),
    ideals: z.string().optional(),
    bonds: z.string().optional(),
    flaws: z.string().optional(),
    appearance: appearanceUpdateZodSchema,
    other: otherUpdateZodSchema,
});

const profileUpdateZodSchema = z.object({
    name: z.string().optional(),
    class: z.string().optional(),
    race: z.string().optional(),
    level: z.number().default(0).optional(),
    xp: z.number().default(0).optional(),
    characteristics: characteristicsUpdateZodSchema.optional(),
});

const hitPointsUpdateZodSchema = z.object({
    points: z.number().optional(),
    currentPoints: z.number().optional(),
    tempPoints: z.number().optional(),
    dicePoints: z.string().optional(),
});

const deathSavesUpdateZodSchema = z.object({
    success: z.number().optional(),
    failures: z.number().optional(),
});

const spellCastingUpdateZodSchema = z.object({
    class: z.string().optional(),
    ability: z.string().optional(),
    saveDc: z.number().optional(),
    attackBonus: z.number().optional(),
});

const statsUpdateZodSchema = z.object({
    proficiencyBonus: z.number().optional(),
    inspiration: z.number().optional(),
    passiveWisdom: z.number().optional(),
    speed: z.number().optional(),
    initiative: z.number().optional(),
    armorClass: z.number().optional(),
    hitPoints: hitPointsUpdateZodSchema,
    deathSaves: deathSavesUpdateZodSchema,
    spellCasting: spellCastingUpdateZodSchema,
});

const moneyUpdateZodSchema = z.object({
    cp: z.number().optional(),
    sp: z.number().optional(),
    ep: z.number().optional(),
    gp: z.number().optional(),
    pp: z.number().optional(),
});

const dataUpdateZodSchema = z.object({
    profile: profileUpdateZodSchema.optional(),
    stats: statsUpdateZodSchema.optional(),
    money: moneyUpdateZodSchema.optional(),
});

const updateCharacterZodSchema = z.object({
    data: dataUpdateZodSchema,
});

const insertOrganizationPictureZodSchema = z.object({
    orgName: z.string(),
});

const insertCharacterPictureZodSchema = z.object({
    picture: z.file(),
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export type TCreateCharacterBody = z.infer<typeof characterPostZodSchema>;
export type TUpdateCharacterBody = z.infer<typeof updateCharacterZodSchema>;
export type TInsertOrgPictureQuery = z.infer<typeof insertOrganizationPictureZodSchema>;
export type TInsertCharacterPictureBody = z.infer<typeof insertCharacterPictureZodSchema>;

export default (): ICharactersSchemas => ({
    postCreateCharacter: {
        body: characterPostZodSchema,
    },
    putUpdateCharacter: {
        body: updateCharacterZodSchema,
    },
    postOrganizationPicture: {
        query: insertOrganizationPictureZodSchema,
    },
    postCharacterPicture: {
        body: insertCharacterPictureZodSchema,
    },
});
