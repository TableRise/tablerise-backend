import { model as mongooseCreateModel, Schema } from 'mongoose';
import { System } from 'src/schemas/systemValidationSchema';
import MongoModel from 'src/database/models/MongoModel';

export const systemMongooseSchema = new Schema<System>({
  name: { type: String, required: true },
  content: {
    races: { type: Array, required: true },
    classes: { type: Array, required: true },
    spells: { type: Array, required: true },
    items: { type: Array, required: true },
    weapons: { type: Array, required: true },
    armors: { type: Array, required: true },
    feats: { type: Array, required: true },
    realms: { type: Array, required: true },
    gods: { type: Array, required: true },
    monsters: { type: Array, required: true }
  },
  references: {
    srd: { type: String, required: true },
    icon: { type: String, required: true },
    cover: { type: String, required: false }
  },
  active: { type: Boolean, required: true }
}, {
  versionKey: false
});

export default class SystemModel extends MongoModel<System> {
  constructor(public model = mongooseCreateModel('system', systemMongooseSchema)) {
    super(model)
  }
}
