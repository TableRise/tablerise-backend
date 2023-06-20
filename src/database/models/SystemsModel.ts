import { model as mongooseCreateModel, Schema } from 'mongoose';
import { ISystem } from 'src/schemas/systemsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';

export const systemsMongooseSchema = new Schema<ISystem>({
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
});

export default class SystemsModel extends MongoModel<ISystem> {
  constructor(public model = mongooseCreateModel('SystemsModel', systemsMongooseSchema)) {
    super(model)
  }
}
