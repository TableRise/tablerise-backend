import { Schema } from 'mongoose';
import Connections from 'src/database/DatabaseConnection';
import { Realm } from 'src/schemas/dungeons&dragons5e/realmsValidationSchema';
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

const model = Connections['dungeons&dragons5e'].model('realm', realmsMongooseSchema);


export default class RealmsModel extends MongoModel<Internacional<Realm>> {
    constructor() {
        super(model);
    }
}
