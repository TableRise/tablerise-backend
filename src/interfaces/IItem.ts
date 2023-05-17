import { z } from 'zod';

const itemZodSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  type: z.enum([
    'arma',
    'armadura',
    'mágico',
    'aventureiro',
    'ferramenta',
    'mundano'
  ]),
  rarity: z.enum([
    'comum',
    'incomum',
    'raro',
    'muito-raro',
    'lendário',
    'único',
    'excepcional'
  ]),
  description: z.string().optional(),
  properties: z.array(z.object({
    name: z.string(),
    description: z.string()
  })).optional(),
  value: z.number().default(0),
  weight: z.string()
});

type IItem = z.infer<typeof itemZodSchema>;

export { type IItem, itemZodSchema };
