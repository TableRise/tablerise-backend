import { Schema } from 'mongoose';
import Connections from 'src/database/DatabaseConnection';
import { Armor, Cost } from 'src/schemas/dungeons&dragons5e/armorsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const costMongooseSchema = new Schema<Cost>(
    {
        currency: { type: String, required: true },
        value: { type: Number, required: true },
    },
    { versionKey: false, _id: false }
);

const schema = new Schema<Armor>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        cost: costMongooseSchema,
        type: { type: String, required: true },
        weight: { type: Number, required: true },
        armorClass: { type: Number, required: true },
        requiredStrength: { type: Number, required: true },
        stealthPenalty: { type: Boolean, required: true },
    },
    { versionKey: false, _id: false }
);

export const armorsMongooseSchema = new Schema<Internacional<Armor>>(
    {
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

const model = Connections['dungeons&dragons5e'].model('armor', armorsMongooseSchema);


export default class ArmorsModel extends MongoModel<Internacional<Armor>> {
    constructor() {
        super(model);
    }
}
