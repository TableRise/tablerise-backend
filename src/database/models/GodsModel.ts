import { model as mongooseCreateModel, Schema } from 'mongoose';
import { God } from 'src/schemas/godsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const schema = new Schema<God>(
    {
        name: { type: String, required: true },
        alignment: { type: String, required: true },
        suggestedDomains: { type: String, required: true },
        symbol: { type: String, required: true },
        phanteon: { type: String, required: true },
    },
    { versionKey: false, _id: false }
);

export const godsMongooseSchema = new Schema<Internacional<God>>(
    {
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

export default class GodsModel extends MongoModel<Internacional<God>> {
    constructor(public model = mongooseCreateModel('god', godsMongooseSchema)) {
        super(model);
    }
}
