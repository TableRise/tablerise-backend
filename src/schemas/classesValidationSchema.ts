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
  invocationsKnown: invocationsKnownZodSchema
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
  characteristics: z.array(characteristicsZodSchema),
  speed: z.number(),
  language: z.array(z.string()),
  skillProficiences: z.array(z.string())
});

export type Class = z.infer<typeof classZodSchema>;

export default classZodSchema;
