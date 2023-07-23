import { model as mongooseCreateModel, Schema } from 'mongoose';
import { MagicItem } from 'src/schemas/magicItemsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const schema = new Schema<MagicItem>(
    {
        name: { type: String, required: true },
        characteristics: { type: [String], required: true },
        description: { type: String, required: true },
    },
    { versionKey: false, _id: false }
);

export const magicItemsMongooseSchema = new Schema<Internacional<MagicItem>>(
    {
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

export default class MagicItemsModel extends MongoModel<Internacional<MagicItem>> {
    constructor(public model = mongooseCreateModel('magicItem', magicItemsMongooseSchema, 'magicItems')) {
        super(model);
    }
}
