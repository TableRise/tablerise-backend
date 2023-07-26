import { model as mongooseCreateModel, Schema } from 'mongoose';
import { Feat } from 'src/schemas/featsValidationSchema';
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
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

export default class FeatsModel extends MongoModel<Internacional<Feat>> {
    constructor(public model = mongooseCreateModel('feat', featsMongooseSchema)) {
        super(model);
    }
}
