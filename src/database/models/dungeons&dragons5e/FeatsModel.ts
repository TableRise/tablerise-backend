import { Schema } from 'mongoose';
import Connections from 'src/database/DatabaseConnection';
import { Feat } from 'src/schemas/dungeons&dragons5e/featsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const schema = new Schema<Feat>(
    {
        name: { type: String, required: true },
        prerequisite: { type: String, required: true },
        description: { type: String, required: true },
        benefits: { type: [String], required: true },
    },
    { versionKey: false, _id: false }
);

export const featsMongooseSchema = new Schema<Internacional<Feat>>(
    {
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

const model = Connections['dungeons&dragons5e'].model('feat', featsMongooseSchema);

export default class FeatsModel extends MongoModel<Internacional<Feat>> {
    constructor() {
        super(model);
    }
}
