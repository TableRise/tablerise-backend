import { Schema } from 'mongoose';
import Connections from 'src/database/DatabaseConnection';
import { Weapon, Cost } from 'src/schemas/dungeons&dragons5e/weaponsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const logger = require('@tablerise/dynamic-logger');

const costMongooseSchema = new Schema<Cost>(
    {
        currency: { type: String, required: true },
        value: { type: Number, required: true },
    },
    { versionKey: false, _id: false }
);

const schema = new Schema<Weapon>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        cost: costMongooseSchema,
        type: { type: String, required: true },
        weight: { type: Number, required: true },
        damage: { type: String, required: true },
        properties: { type: [String], required: true },
    },
    { versionKey: false, _id: false }
);

export const weaponsMongooseSchema = new Schema<Internacional<Weapon>>(
    {
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

const model = Connections['dungeons&dragons5e'].model('weapon', weaponsMongooseSchema);
if (!model) logger('error', 'Some error was occurred in dungeons&dragons5e connection instance');

export default class WeaponsModel extends MongoModel<Internacional<Weapon>> {
    constructor() {
        super(model);
    }
}
