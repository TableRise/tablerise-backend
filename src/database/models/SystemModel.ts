import { model as mongooseCreateModel, Schema } from 'mongoose';
import { System } from 'src/schemas/systemValidationSchema';
import MongoModel from 'src/database/models/MongoModel';

export const systemMongooseSchema = new Schema<System>({
  name: { type: String, required: true },
  content: {
    races: { type: [String], required: true },
    classes: { type: [String], required: true },
    spells: { type: [String], required: true },
    items: { type: [String], required: true },
    weapons: { type: [String], required: true },
    armors: { type: [String], required: true },
    feats: { type: [String], required: true },
    realms: { type: [String], required: true },
    gods: { type: [String], required: true },
    monsters: { type: [String], required: true }
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
