import { z } from 'zod';

const tradeGoodsZodSchema = z.object({
    isValid: z.boolean(),
    goods: z.string(),
});

const mountOrVehicleZodSchema = z.object({
    isValid: z.boolean(),
    speed: z.string(),
    carryingCapacity: z.string(),
});

const costZodSchema = z.object({
    currency: z.string(),
    value: z.number(),
});

const itemsZodSchema = z.object({
    name: z.string(),
    description: z.string(),
    cost: costZodSchema,
    type: z.string(),
    weight: z.number(),
    mountOrVehicle: mountOrVehicleZodSchema,
    tradeGoods: tradeGoodsZodSchema,
});

export type Item = z.infer<typeof itemsZodSchema>;

export default itemsZodSchema;
