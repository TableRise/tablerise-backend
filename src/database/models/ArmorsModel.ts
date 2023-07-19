import { model as mongooseCreateModel, Schema } from 'mongoose';
import { Armor } from 'src/schemas/armorsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const schema = new Schema<Armor>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost: {
    currency: { type: String, required: true },
    value: { type: Number, required: true }
  },
  type: { type: String, required: true },
  weight: { type: Number, required: true },
  armorClass: { type: Number, required: true },
  requiredStrength: { type: Number, required: true },
  stealthPenalty: { type: Boolean, required: true }
});

export const armorsMongooseSchema = new Schema<Internacional<Armor>>({
  en: schema,
  pt: schema
}, {
  versionKey: false
});

export default class ArmorsModel extends MongoModel<Internacional<Armor>> {
  constructor(public model = mongooseCreateModel('armor', armorsMongooseSchema)) {
    super(model)
  }
}