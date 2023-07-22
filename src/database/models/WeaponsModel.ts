import { model as mongooseCreateModel, Schema } from 'mongoose';
import { Weapon, Cost } from 'src/schemas/weaponsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const costMongooseSchema = new Schema<Cost>({
  currency: { type: String, required: true },
  value: { type: Number, required: true }
});

const schema = new Schema<Weapon>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost: costMongooseSchema,
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
