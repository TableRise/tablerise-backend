import { Schema } from 'mongoose';
import Connections from 'src/database/DatabaseConnection';
import { System, SystemContent, SystemReference } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import MongoModel from 'src/database/models/MongoModel';

const systemReferenceMongooseSchema = new Schema<SystemReference>(
    {
        srd: { type: String, required: true },
        icon: { type: String, required: true },
        cover: { type: String, required: false },
    },
    { versionKey: false, _id: false }
);

const systemContentMongooseSchema = new Schema<SystemContent>(
    {
        races: { type: [String], required: true },
        classes: { type: [String], required: true },
        spells: { type: [String], required: true },
        items: { type: [String], required: true },
        weapons: { type: [String], required: true },
        armors: { type: [String], required: true },
        feats: { type: [String], required: true },
        realms: { type: [String], required: true },
        gods: { type: [String], required: true },
        monsters: { type: [String], required: true },
    },
    { versionKey: false, _id: false }
);

const systemMongooseSchema = new Schema<System>(
    {
        name: { type: String, required: true },
        content: systemContentMongooseSchema,
        references: systemReferenceMongooseSchema,
        active: { type: Boolean, required: true },
    },
    {
        versionKey: false,
    }
);

const model = Connections['dungeons&dragons5e'].model('system', systemMongooseSchema);


export default class SystemModel extends MongoModel<System> {
    constructor() {
        super(model);
    }
}
