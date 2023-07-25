import { model as mongooseCreateModel, Schema } from 'mongoose';
import {
    Class,
    HitPoints,
    Proficiencies,
    Equipment,
    CantripsKnown,
    SpellSlotsPerSpellLevel,
    SpellsKnown,
    KiPoints,
    MartialArts,
    UnarmoredMovement,
    SneakAttack,
    SorceryPoints,
    InvocationsKnown,
    Rages,
    RageDamage,
    LevelingSpecs,
    Characteristics,
} from 'src/schemas/classesValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const hitPointsMongooseSchema = new Schema<HitPoints>(
    {
        hitDice: { type: String, required: true },
        hitPointsAtFirstLevel: { type: String, required: true },
        hitPointsAtHigherLevels: { type: String, required: true },
    },
    { versionKey: false, _id: false }
);

const proficienciesMongooseSchema = new Schema<Proficiencies>(
    {
        armor: { type: [String], required: true },
        weapons: { type: [String], required: true },
        tools: { type: [String], required: true },
        savingThrows: { type: [String], required: true },
        skills: { type: [String], required: true },
    },
    { versionKey: false, _id: false }
);

const equipmentMongooseSchema = new Schema<Equipment>(
    {
        a: { type: String, required: true },
        b: { type: String, required: true },
    },
    { versionKey: false, _id: false }
);

const cantripsKnownMongooseSchema = new Schema<CantripsKnown>(
    {
        isValidToThisClass: { type: Boolean, required: true },
        amount: { type: [Number], required: true },
    },
    { versionKey: false, _id: false }
);

const spellSlotsPerSpellLevelMongooseSchema = new Schema<SpellSlotsPerSpellLevel>(
    {
        isValidToThisClass: { type: Boolean, required: true },
        spellLevel: { type: [Number], required: true },
        spellSpaces: { type: [Number], required: true },
    },
    { versionKey: false, _id: false }
);

const spellsKnownMongooseSchema = new Schema<SpellsKnown>(
    {
        isValidToThisClass: { type: Boolean, required: true },
        amount: { type: [Number], required: true },
    },
    { versionKey: false, _id: false }
);

const kiPointsMongooseSchema = new Schema<KiPoints>(
    {
        isValidToThisClass: { type: Boolean, required: true },
        amount: { type: [Number], required: true },
    },
    { versionKey: false, _id: false }
);

const martialArtsMongooseSchema = new Schema<MartialArts>(
    {
        isValidToThisClass: { type: Boolean, required: true },
        amount: { type: [Number], required: true },
    },
    { versionKey: false, _id: false }
);

const unarmoredMovementMongooseSchema = new Schema<UnarmoredMovement>(
    {
        isValidToThisClass: { type: Boolean, required: true },
        amount: { type: [Number], required: true },
    },
    { versionKey: false, _id: false }
);

const sneakAttackMongooseSchema = new Schema<SneakAttack>(
    {
        isValidToThisClass: { type: Boolean, required: true },
        amount: { type: [Number], required: true },
    },
    { versionKey: false, _id: false }
);

const sorceryPointsMongooseSchema = new Schema<SorceryPoints>(
    {
        isValidToThisClass: { type: Boolean, required: true },
        amount: { type: [Number], required: true },
    },
    { versionKey: false, _id: false }
);

const invocationsKnownMongooseSchema = new Schema<InvocationsKnown>(
    {
        isValidToThisClass: { type: Boolean, required: true },
        amount: { type: [Number], required: true },
    },
    { versionKey: false, _id: false }
);

const ragesMongooseSchema = new Schema<Rages>(
    {
        isValidToThisClass: { type: Boolean, required: true },
        amount: { type: [Number], required: true },
    },
    { versionKey: false, _id: false }
);

const rageDamageMongooseSchema = new Schema<RageDamage>(
    {
        isValidToThisClass: { type: Boolean, required: true },
        amount: { type: [Number], required: true },
    },
    { versionKey: false, _id: false }
);

const levelingSpecsMongooseSchema = new Schema<LevelingSpecs>(
    {
        level: { type: [Number], required: true },
        proficiencyBonus: { type: [Number], required: true },
        features: { type: [String], required: true },
        cantripsKnown: cantripsKnownMongooseSchema,
        spellSlotsPerSpellLevel: spellSlotsPerSpellLevelMongooseSchema,
        spellsKnown: spellsKnownMongooseSchema,
        kiPoints: kiPointsMongooseSchema,
        martialArts: martialArtsMongooseSchema,
        unarmoredMovement: unarmoredMovementMongooseSchema,
        sneakAttack: sneakAttackMongooseSchema,
        sorceryPoints: sorceryPointsMongooseSchema,
        invocationsKnown: invocationsKnownMongooseSchema,
        rages: ragesMongooseSchema,
        rageDamage: rageDamageMongooseSchema,
    },
    { versionKey: false, _id: false }
);

const characteristicsMongooseSchema = new Schema<Characteristics>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    { versionKey: false, _id: false }
);

const schema = new Schema<Class>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        hitPoints: hitPointsMongooseSchema,
        proficiencies: proficienciesMongooseSchema,
        equipment: [equipmentMongooseSchema],
        levelingSpecs: levelingSpecsMongooseSchema,
        characteristics: [characteristicsMongooseSchema],
    },
    { versionKey: false, _id: false }
);

export const classsMongooseSchema = new Schema<Internacional<Class>>(
    {
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

export default class ClasssModel extends MongoModel<Internacional<Class>> {
    constructor(public model = mongooseCreateModel('class', classsMongooseSchema)) {
        super(model);
    }
}
