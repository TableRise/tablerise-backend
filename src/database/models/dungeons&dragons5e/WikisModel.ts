import { Schema } from 'mongoose';
import Connections from 'src/database/DatabaseConnection';
import { Wiki, SubTopic } from 'src/schemas/dungeons&dragons5e/wikisValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const logger = require('@tablerise/dynamic-logger');

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

const model = Connections['dungeons&dragons5e'].model('wiki', wikisMongooseSchema);
if (!model) logger('error', 'Some error was occurred in dungeons&dragons5e connection instance');

export default class WikisModel extends MongoModel<Internacional<Wiki>> {
    constructor() {
        super(model);
    }
}
