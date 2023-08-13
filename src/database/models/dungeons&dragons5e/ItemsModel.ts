import { Schema } from 'mongoose';
import Connections from 'src/database/DatabaseConnection';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Item, MountOrVehicle, TradeGoods, Cost } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import MongoModel from 'src/database/models/MongoModel';

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

const model = Connections['dungeons&dragons5e'].model('item', itemsMongooseSchema);

export default class ItemsModel extends MongoModel<Internacional<Item>> {
    constructor() {
        super(model);
    }
}
