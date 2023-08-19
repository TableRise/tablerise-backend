import { Schema } from 'mongoose';
import Connections from 'src/database/DatabaseConnection';
import { Spell, Damage, HigherLevels } from 'src/schemas/dungeons&dragons5e/spellsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const damageMongooseSchema = new Schema<Damage>(
    {
        type: { type: String, required: true },
        dice: { type: String, required: true },
    },
    { versionKey: false, _id: false }
);

const higherLevelsMongooseSchema = new Schema<HigherLevels>(
    {
        level: { type: String, required: true },
        damage: { type: [damageMongooseSchema], required: true },
        buffs: { type: [String], required: true },
        debuffs: { type: [String], required: true },
    },
    { versionKey: false, _id: false }
);

const schema = new Schema<Spell>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, required: true },
        level: { type: Number, required: true },
        higherLevels: { type: [higherLevelsMongooseSchema], required: true },
        damage: { type: [damageMongooseSchema], required: false },
        castingTime: { type: String, required: true },
        duration: { type: String, required: true },
        range: { type: String, required: true },
        components: { type: String, required: true },
        buffs: { type: [String], required: true },
        debuffs: { type: [String], required: true },
    },
    { versionKey: false, _id: false }
);

export const spellsMongooseSchema = new Schema<Internacional<Spell>>(
    {
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

const model = Connections['dungeons&dragons5e'].model('spell', spellsMongooseSchema);

export default class SpellsModel extends MongoModel<Internacional<Spell>> {
    constructor() {
        super(model);
    }
}
