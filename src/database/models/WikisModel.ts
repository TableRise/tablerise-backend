import { model as mongooseCreateModel, Schema } from 'mongoose';
import { Wiki, SubTopic } from 'src/schemas/wikisValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
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
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

export default class WikisModel extends MongoModel<Internacional<Wiki>> {
    constructor(public model = mongooseCreateModel('wiki', wikisMongooseSchema)) {
        super(model);
    }
}
