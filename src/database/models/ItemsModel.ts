import { model as mongooseCreateModel, Schema } from 'mongoose';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Item, MountOrVehicle, TradeGoods } from 'src/schemas/itemsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';

const mountOrVehicleSchema = new Schema<MountOrVehicle>({
  isValid: { type: Boolean, required: true },
  speed: { type: String, required: true },
  carryingCapacity: { type: String, required: true }
});

const tradeGoodsSchema = new Schema<TradeGoods>({
  isValid: { type: Boolean, required: true },
  goods: { type: String, required: true }
})

const schema = new Schema<Item>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  type: { type: String, required: true },
  weight: { type: Number, required: true },
  mountOrVehicle: mountOrVehicleSchema,
  tradeGoods: tradeGoodsSchema
});

export const itemsMongooseSchema = new Schema<Internacional<Item>>({
  en: schema,
  pt: schema
}, {
  versionKey: false
});

export default class ItemsModel extends MongoModel<Internacional<Item>> {
  constructor(public model = mongooseCreateModel('item', itemsMongooseSchema)) {
    super(model)
  }
}
