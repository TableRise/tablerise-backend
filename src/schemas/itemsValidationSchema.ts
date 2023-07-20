import { z } from 'zod';

const tradeGoodsZodSchema = z.object({
  isValid: z.boolean(),
  goods: z.string()
});

const mountOrVehicleZodSchema = z.object({
  isValid: z.boolean(),
  speed: z.string(),
  carryingCapacity: z.string()
});

const itemsZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  cost: z.number(),
  type: z.string(),
  weight: z.number(),
  mountOrVehicle: mountOrVehicleZodSchema,
  tradeGoods: tradeGoodsZodSchema
});

export type Item = z.infer<typeof itemsZodSchema>;

export default itemsZodSchema;
