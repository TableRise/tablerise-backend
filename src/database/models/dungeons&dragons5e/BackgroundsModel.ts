import { Schema } from 'mongoose';
import Connections from 'src/server';
import { Background, BackgroundCharacteristics, BackgroundSuggested } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const logger = require('@tablerise/dynamic-logger');

const mongooseCreateModel = Connections['dungeons&dragons5e'].model;
if (!mongooseCreateModel) logger('error', 'Some error was occurred in dungeons&dragons5e connection instance');

const suggestedSchema = new Schema<BackgroundSuggested>(
    {
        personalityTrait: { type: [String], required: true },
        ideal: { type: [String], required: true },
        bond: { type: [String], required: true },
        flaw: { type: [String], required: true },
    },
    { versionKey: false, _id: false }
);

const characteristicsSchema = new Schema<BackgroundCharacteristics>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        suggested: suggestedSchema,
    },
    { versionKey: false, _id: false }
);

const schema = new Schema<Background>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        skillProficiences: { type: [String], required: true },
        languages: { type: [String], required: true },
        equipment: { type: [String], required: true },
        characteristics: characteristicsSchema,
    },
    { versionKey: false, _id: false }
);

export const backgroundsMongooseSchema = new Schema<Internacional<Background>>(
    {
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

export default class BackgroundsModel extends MongoModel<Internacional<Background>> {
    constructor(public model = mongooseCreateModel('background', backgroundsMongooseSchema)) {
        super(model);
    }
}
