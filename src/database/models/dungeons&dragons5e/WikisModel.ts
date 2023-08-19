import mongoose, { Schema } from 'mongoose';
import { Wiki, SubTopic } from 'src/schemas/dungeons&dragons5e/wikisValidationSchema';
import MongoModel from '../../models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const subTopicsMongooseSchema = new Schema<SubTopic>(
    {
        subTitle: { type: String, required: true },
        description: { type: String, required: true },
    },
    { versionKey: false, _id: false }
);

const schema = new Schema<Wiki>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        reference: { type: String, required: true },
        image: { type: String, required: true },
        subTopics: { type: [subTopicsMongooseSchema], required: true },
    },
    { versionKey: false, _id: false }
);

export const wikisMongooseSchema = new Schema<Internacional<Wiki>>(
    {
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

const connection = mongoose.connection.useDb('dungeons&dragons5e', { noListener: true, useCache: true });

export default class WikisModel extends MongoModel<Internacional<Wiki>> {
    constructor(public model = connection.model('wiki', wikisMongooseSchema)) {
        super(model);
    }
}
