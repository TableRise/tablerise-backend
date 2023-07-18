import { model as mongooseCreateModel, Schema } from 'mongoose';
import { Weapon } from 'src/schemas/weaponsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const schema = new Schema<Weapon>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost: {
    currency: { type: String, required: true },
    value: { type: Number, required: true }
  },
  type: { type: String, required: true },
  weight: { type: Number, required: true },
  damage: { type: String, required: true },
  properties: { type: [String], required: true }
});

export const weaponsMongooseSchema = new Schema<Internacional<Weapon>>({
  en: schema,
  pt: schema
}, {
  versionKey: false
});

export default class WeaponsModel extends MongoModel<Internacional<Weapon>> {
  constructor(public model = mongooseCreateModel('weapon', weaponsMongooseSchema)) {
    super(model)
  }
}
