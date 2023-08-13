import { Schema } from 'mongoose';
import Connections from 'src/server';
import { Realm } from 'src/schemas/dungeons&dragons5e/realmsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const logger = require('@tablerise/dynamic-logger');

const mongooseCreateModel = Connections['dungeons&dragons5e'].model;
if (!mongooseCreateModel) logger('error', 'Some error was occurred in dungeons&dragons5e connection instance');

const schema = new Schema<Realm>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        thumbnail: { type: String, required: true },
    },
    { versionKey: false, _id: false }
);

export const realmsMongooseSchema = new Schema<Internacional<Realm>>(
    {
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

export default class RealmsModel extends MongoModel<Internacional<Realm>> {
    constructor(public model = mongooseCreateModel('realm', realmsMongooseSchema)) {
        super(model);
    }
}
