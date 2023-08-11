import { Schema } from 'mongoose';
import Connections from 'src/server';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Race, SubRace, Characteristic, AbilityScoreIncrease } from 'src/schemas/racesValidationSchema';
import MongoModel from 'src/database/models/MongoModel';

const logger = require('@tablerise/dynamic-logger');

const mongooseCreateModel = Connections['dungeons&dragons5e'].model;
if (!mongooseCreateModel) logger('error', 'Some error was occurred in dungeons&dragons5e connection instance');

const abilityScoreIncreaseSchema = new Schema<AbilityScoreIncrease>({
    name: { type: String, required: true },
    value: { type: Number, required: true },
});

const characteristicsSchema = new Schema<Characteristic>({
    name: { type: String, required: true },
    description: { type: String, required: true },
});

const subRacesSchema = new Schema<SubRace>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    abilityScoreIncrease: abilityScoreIncreaseSchema,
    characteristics: { type: [characteristicsSchema], required: true },
});

const schema = new Schema<Race>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    abilityScoreIncrease: abilityScoreIncreaseSchema,
    ageMax: { type: Number, required: true },
    alignment: { type: [String], required: true },
    heightMax: { type: Number, required: true },
    speed: { type: [String, Number], required: true },
    language: { type: [String], required: true },
    subRaces: { type: [subRacesSchema], required: true },
    skillProficiences: { type: [String], required: true },
    characterstics: { type: [characteristicsSchema], required: true },
    weightMax: { type: Number, required: true },
});

export const racesMongooseSchema = new Schema<Internacional<Race>>(
    {
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

export default class RacesModel extends MongoModel<Internacional<Race>> {
    constructor(public model = mongooseCreateModel('race', racesMongooseSchema)) {
        super(model);
    }
}
