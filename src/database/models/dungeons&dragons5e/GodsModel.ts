import { Schema } from 'mongoose';
import Connections from 'src/database/DatabaseConnection';
import { God } from 'src/schemas/dungeons&dragons5e/godsValidationSchema';
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
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

const model = Connections['dungeons&dragons5e'].model('god', godsMongooseSchema);

export default class GodsModel extends MongoModel<Internacional<God>> {
    constructor() {
        super(model);
    }
}
