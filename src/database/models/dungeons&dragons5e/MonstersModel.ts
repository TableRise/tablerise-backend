import { Schema } from 'mongoose';
import Connections from 'src/database/DatabaseConnection';
import {
    Monster,
    HitPoints,
    SavingThrows,
    Stats,
    AbilityScore,
    Skills,
    Actions,
} from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const logger = require('@tablerise/dynamic-logger');

const hitPointsMongooseSchema = new Schema<HitPoints>(
    {
        hitDice: { type: String, required: true },
        default: { type: Number, required: true },
    },
    { versionKey: false, _id: false }
);

const savingThrowsMongooseSchema = new Schema<SavingThrows>(
    {
        name: { type: String, required: true },
        value: { type: Number, required: true },
    },
    { versionKey: false, _id: false }
);

const statsMongooseSchema = new Schema<Stats>(
    {
        armorClass: { type: Number, required: true },
        hitPoints: { type: hitPointsMongooseSchema, required: true },
        speed: { type: String, required: true },
        savingThrows: { type: [savingThrowsMongooseSchema], required: true },
        damageImmunities: { type: [String], required: true },
        conditionImmunities: { type: [String], required: true },
        damageResistances: { type: [String], required: true },
        senses: { type: [String], required: true },
        languages: { type: [String], required: true },
        challengeLevel: { type: Number, required: true },
    },
    { versionKey: false, _id: false }
);

const abilityScoreMongooseSchema = new Schema<AbilityScore>(
    {
        name: { type: String, required: true },
        value: { type: Number, required: true },
        modifier: { type: Number, required: true },
    },
    { versionKey: false, _id: false }
);

const skillsMongooseSchema = new Schema<Skills>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
    },
    { versionKey: false, _id: false }
);

const actionsMongooseSchema = new Schema<Actions>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, required: true },
    },
    { versionKey: false, _id: false }
);

const schema = new Schema<Monster>(
    {
        name: { type: String, required: true },
        characteristics: { type: [String], required: true },
        stats: { type: statsMongooseSchema, required: true },
        abilityScore: { type: [abilityScoreMongooseSchema], required: true },
        skills: { type: [skillsMongooseSchema], required: true },
        actions: { type: [actionsMongooseSchema], required: true },
        picture: { type: String, required: true },
    },
    { versionKey: false, _id: false }
);

export const monstersMongooseSchema = new Schema<Internacional<Monster>>(
    {
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

const model = Connections['dungeons&dragons5e'].model('monster', monstersMongooseSchema);
if (!model) logger('error', 'Some error was occurred in dungeons&dragons5e connection instance');

export default class SpellsModel extends MongoModel<Internacional<Monster>> {
    constructor() {
        super(model);
    }
}
