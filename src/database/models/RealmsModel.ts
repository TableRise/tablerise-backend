import { model as mongooseCreateModel, Schema } from 'mongoose';
import { Realm } from 'src/schemas/realmsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

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
