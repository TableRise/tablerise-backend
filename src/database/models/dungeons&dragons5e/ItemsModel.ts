import mongoose, { Schema } from 'mongoose';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Item, MountOrVehicle, TradeGoods, Cost } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import MongoModel from '../../models/MongoModel';

const costSchema = new Schema<Cost>({
    currency: { type: String, required: true },
    value: { type: Number, required: true },
});

const mountOrVehicleSchema = new Schema<MountOrVehicle>({
    isValid: { type: Boolean, required: true },
    speed: { type: String, required: true },
    carryingCapacity: { type: String, required: true },
});

const tradeGoodsSchema = new Schema<TradeGoods>({
    isValid: { type: Boolean, required: true },
    goods: { type: String, required: true },
});

const schema = new Schema<Item>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    cost: costSchema,
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    mountOrVehicle: mountOrVehicleSchema,
    tradeGoods: tradeGoodsSchema,
});

export const itemsMongooseSchema = new Schema<Internacional<Item>>(
    {
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

const connection = mongoose.connection.useDb('dungeons&dragons5e', { noListener: true, useCache: true });

export default class ItemsModel extends MongoModel<Internacional<Item>> {
    constructor(public model = connection.model('item', itemsMongooseSchema)) {
        super(model);
    }
}
