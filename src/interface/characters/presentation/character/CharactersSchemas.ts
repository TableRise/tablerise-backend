import { z } from 'zod';
import { ICharactersSchemas } from 'src/types/modules/interface/characters/presentation/characters/CharactersSchemas';
import { optionalImageObjectZodSchema } from 'src/domains/common/schemas/commonValidationSchema';
import uploadedFileSchema from 'src/interface/common/helpers/uploadedFileSchema';

// ─── POST (create) ────────────────────────────────────────────────────────────

const appearanceCharacterZodSchema = z.object({
    description: z.string(),
    eyes: z.string(),
    age: z.string(),
    weight: z.string(),
    height: z.string(),
    skin: z.string(),
    hair: z.string(),
    picture: z.any().optional(),
});

const otherCharacterZodSchema = z.object({
    characteristicsAndAbilities: z.string(),
});

const characteristicsCharacterZodSchema = z.object({
    alignment: z.string(),
    backstory: z.string(),
    background: z.string(),
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
    level: z.number(),
    prevLevel: z.number().optional(),
    notificationOn: z.boolean().optional(),
    xp: z.number(),
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
    abilityScores: z.array(abilityScoresZodSchema),
    skills: z.array(z.object({ name: z.string(), value: z.number(), checked: z.boolean() })).optional(),
    proficiencyBonus: z.number(),
    inspiration: z.number(),
    passiveWisdom: z.number(),
    speed: z.number(),
    initiative: z.number(),
    armorClass: z.number(),
    hitPoints: hitPointsCharacterZodSchema,
    deathSaves: deathSavesCharacterZodSchema,
    spellCasting: spellCastingCharacterZodSchema,
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

const extraAbilityLevelCharacterZodSchema = z.object({
    extraAbilityNames: z.array(z.string()).optional(),
    slotsTotal: z.number().optional(),
    slotsExpended: z.number().optional(),
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

const extraAbilitiesCharacterZodSchema = z.object({
    cantrips: z.array(z.string()).optional(),
    1: extraAbilityLevelCharacterZodSchema.optional(),
    2: extraAbilityLevelCharacterZodSchema.optional(),
    3: extraAbilityLevelCharacterZodSchema.optional(),
    4: extraAbilityLevelCharacterZodSchema.optional(),
    5: extraAbilityLevelCharacterZodSchema.optional(),
    6: extraAbilityLevelCharacterZodSchema.optional(),
    7: extraAbilityLevelCharacterZodSchema.optional(),
    8: extraAbilityLevelCharacterZodSchema.optional(),
    9: extraAbilityLevelCharacterZodSchema.optional(),
});

const dataCharacterZodSchema = z.object({
    profile: profileCharacterZodSchema,
    stats: statsCharacterZodSchema,
    inventory: z.string(),
    equipments: z.array(z.any()).optional(),
    money: moneyCharacterZodSchema,
    spells: spellsCharacterZodSchema,
    extraAbilities: extraAbilitiesCharacterZodSchema.optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

const characterPostZodSchema = z.object({
    data: dataCharacterZodSchema,
    npc: z.boolean().default(false),
});

// ─── PUT (update) ─────────────────────────────────────────────────────────────

const appearanceUpdateZodSchema = z.object({
    description: z.string().optional(),
    eyes: z.string().optional(),
    age: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
    skin: z.string().optional(),
    hair: z.string().optional(),
    picture: z.any().optional(),
});

const otherUpdateZodSchema = z.object({
    characteristicsAndAbilities: z.string().optional(),
});

const characteristicsUpdateZodSchema = z.object({
    alignment: z.string().optional(),
    backstory: z.string().optional(),
    background: z.string().optional(),
    personalityTraits: z.string().optional(),
    ideals: z.string().optional(),
    bonds: z.string().optional(),
    flaws: z.string().optional(),
    appearance: appearanceUpdateZodSchema,
    other: otherUpdateZodSchema,
    alliesAndOrgs: z.string().optional(),
    treasure: z.string().optional(),
});

const profileUpdateZodSchema = z.object({
    name: z.string().optional(),
    class: z.string().optional(),
    race: z.string().optional(),
    level: z.number().default(0).optional(),
    prevLevel: z.number().optional(),
    notificationOn: z.boolean().optional(),
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
    hitPoints: hitPointsUpdateZodSchema.optional(),
    deathSaves: deathSavesUpdateZodSchema.optional(),
    spellCasting: spellCastingUpdateZodSchema.optional(),
    abilityScores: z.array(abilityScoresZodSchema).optional(),
    skills: z.array(z.object({ name: z.string(), value: z.number(), checked: z.boolean() })).optional(),
});

const moneyUpdateZodSchema = z.object({
    cp: z.number().optional(),
    sp: z.number().optional(),
    ep: z.number().optional(),
    gp: z.number().optional(),
    pp: z.number().optional(),
});

const spellLevelUpdateZodSchema = z.object({
    spellIds: z.array(z.string()).optional(),
    slotsTotal: z.number().optional(),
    slotsExpended: z.number().optional(),
});

const spellsUpdateZodSchema = z.object({
    cantrips: z.array(z.string()).optional(),
    1: spellLevelUpdateZodSchema.optional(),
    2: spellLevelUpdateZodSchema.optional(),
    3: spellLevelUpdateZodSchema.optional(),
    4: spellLevelUpdateZodSchema.optional(),
    5: spellLevelUpdateZodSchema.optional(),
    6: spellLevelUpdateZodSchema.optional(),
    7: spellLevelUpdateZodSchema.optional(),
    8: spellLevelUpdateZodSchema.optional(),
    9: spellLevelUpdateZodSchema.optional(),
});

const extraAbilityLevelUpdateZodSchema = z.object({
    extraAbilityNames: z.array(z.string()).optional(),
    slotsTotal: z.number().optional(),
    slotsExpended: z.number().optional(),
});

const extraAbilitiesUpdateZodSchema = z.object({
    cantrips: z.array(z.string()).optional(),
    1: extraAbilityLevelUpdateZodSchema.optional(),
    2: extraAbilityLevelUpdateZodSchema.optional(),
    3: extraAbilityLevelUpdateZodSchema.optional(),
    4: extraAbilityLevelUpdateZodSchema.optional(),
    5: extraAbilityLevelUpdateZodSchema.optional(),
    6: extraAbilityLevelUpdateZodSchema.optional(),
    7: extraAbilityLevelUpdateZodSchema.optional(),
    8: extraAbilityLevelUpdateZodSchema.optional(),
    9: extraAbilityLevelUpdateZodSchema.optional(),
});

const dataUpdateZodSchema = z.object({
    profile: profileUpdateZodSchema.optional(),
    stats: statsUpdateZodSchema.optional(),
    money: moneyUpdateZodSchema.optional(),
    spells: spellsUpdateZodSchema.optional(),
    extraAbilities: extraAbilitiesUpdateZodSchema.optional(),
    inventory: z.string().optional(),
});

const updateCharacterZodSchema = z.object({
    data: dataUpdateZodSchema,
});

const insertCharacterPictureZodSchema = z
    .object({
        picture: uploadedFileSchema.optional(),
        imageObject: optionalImageObjectZodSchema,
    })
    .refine((payload) => payload.picture !== undefined || payload.imageObject !== undefined, {
        message: 'Either picture or imageObject is required',
        path: ['picture'],
    });

const updateMoneyZodSchema = z.object({
    operation: z.enum(['add', 'subtract']),
    money: z.number(),
    moneyType: z.enum(['PC', 'PP', 'PE', 'PO', 'PL']),
});

const updateEquipmentQueryZodSchema = z.object({
    equipmentId: z.string(),
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export type TCreateCharacterBody = z.infer<typeof characterPostZodSchema>;
export type TUpdateCharacterBody = z.infer<typeof updateCharacterZodSchema>;
export type TInsertCharacterPictureBody = z.infer<typeof insertCharacterPictureZodSchema>;
export type TUpdateMoneyBody = z.infer<typeof updateMoneyZodSchema>;

export default (): ICharactersSchemas => ({
    postCreateCharacter: {
        body: characterPostZodSchema,
    },
    putUpdateCharacter: {
        body: updateCharacterZodSchema,
    },
    postCharacterPicture: {
        body: insertCharacterPictureZodSchema,
    },
    patchAddEquipment: {
        query: updateEquipmentQueryZodSchema,
    },
    patchRemoveEquipment: {
        query: updateEquipmentQueryZodSchema,
    },
    patchUpdateMoney: {
        body: updateMoneyZodSchema,
    },
});
