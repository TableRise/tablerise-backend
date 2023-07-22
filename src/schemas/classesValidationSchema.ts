import { z } from 'zod';

const hitPointsZodSchema = z.object({
  hitDice: z.string(),
  hitPointsAtFirstLevel: z.string(),
  hitPointsAtHigherLevels: z.string()
});

const proficienciesZodSchema = z.object({
  armor: z.array(z.string()),
  weapons: z.array(z.string()),
  tools: z.array(z.string()),
  savingThrows: z.array(z.string()),
  skills: z.array(z.string())
});

const equipmentZodSchema = z.object({
  a: z.string().length(24),
  b: z.string().length(24)
});

const cantripsKnownZodSchema = z.object({
  isValidToThisClass: z.boolean(),
  amount: z.array(z.number())
});

const spellSlotsPerSpellLevelZodSchema = z.object({
  isValidToThisClass: z.boolean(),
  spellLevel: z.array(z.number()),
  spellSpaces: z.array(z.number())
});

const spellsKnownZodSchema = z.object({
  isValidToThisClass: z.boolean(),
  amount: z.array(z.number())
});

const kiPointsZodSchema = z.object({
  isValidToThisClass: z.boolean(),
  amount: z.array(z.number())
});

const martialArtsZodSchema = z.object({
  isValidToThisClass: z.boolean(),
  amount: z.array(z.number())
});

const unarmoredMovementZodSchema = z.object({
  isValidToThisClass: z.boolean(),
  amount: z.array(z.number())
});

const sneakAttackZodSchema = z.object({
  isValidToThisClass: z.boolean(),
  amount: z.array(z.number())
});

const sorceryPointsZodSchema = z.object({
  isValidToThisClass: z.boolean(),
  amount: z.array(z.number())
});

const invocationsKnownZodSchema = z.object({
  isValidToThisClass: z.boolean(),
  amount: z.array(z.number())
});

const ragesZodSchema = z.object({
  isValidToThisClass: z.boolean(),
  amount: z.array(z.number())
});

const rageDamageZodSchema = z.object({
  isValidToThisClass: z.boolean(),
  amount: z.array(z.number())
});

const levelingSpecsZodSchema = z.object({
  level: z.array(z.number()),
  proficiencyBonus: z.array(z.number()),
  features: z.array(z.string()),
  cantripsKnown: cantripsKnownZodSchema,
  spellSlotsPerSpellLevel: spellSlotsPerSpellLevelZodSchema,
  spellsKnown: spellsKnownZodSchema,
  kiPoints: kiPointsZodSchema,
  martialArts: martialArtsZodSchema,
  unarmoredMovement: unarmoredMovementZodSchema,
  sneakAttack: sneakAttackZodSchema,
  sorceryPoints: sorceryPointsZodSchema,
  invocationsKnown: invocationsKnownZodSchema,
  rages: ragesZodSchema,
  rageDamage: rageDamageZodSchema
});

const characteristicsZodSchema = z.object({
  title: z.string(),
  description: z.string()
});

const classZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  hitPoints: hitPointsZodSchema,
  proficiencies: proficienciesZodSchema,
  equipment: z.array(equipmentZodSchema),
  levelingSpecs: levelingSpecsZodSchema,
  characteristics: z.array(characteristicsZodSchema)
});

export type Class = z.infer<typeof classZodSchema>;
export type HitPoints = z.infer<typeof hitPointsZodSchema>;
export type Proficiencies = z.infer<typeof proficienciesZodSchema>;
export type Equipment = z.infer<typeof equipmentZodSchema>;
export type CantripsKnown = z.infer<typeof cantripsKnownZodSchema>;
export type SpellSlotsPerSpellLevel = z.infer<typeof spellSlotsPerSpellLevelZodSchema>;
export type SpellsKnown = z.infer<typeof spellsKnownZodSchema>;
export type KiPoints = z.infer<typeof kiPointsZodSchema>;
export type MartialArts = z.infer<typeof martialArtsZodSchema>;
export type UnarmoredMovement = z.infer<typeof unarmoredMovementZodSchema>;
export type SneakAttack = z.infer<typeof sneakAttackZodSchema>;
export type SorceryPoints = z.infer<typeof sorceryPointsZodSchema>;
export type InvocationsKnown = z.infer<typeof invocationsKnownZodSchema>;
export type Rages = z.infer<typeof ragesZodSchema>;
export type RageDamage = z.infer<typeof rageDamageZodSchema>;
export type LevelingSpecs = z.infer<typeof levelingSpecsZodSchema>;
export type Characteristics = z.infer<typeof characteristicsZodSchema>;

export default classZodSchema;
