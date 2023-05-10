import { z } from 'zod';

const itemZodSchema = z.object({
  system_id: z.string(),
  name: z.string(),
  type: z.enum([
    'arma',
    'armadura',
    'mágico',
    'aventureiro',
    'ferramenta',
    'mundano',
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
  properties: z.string().optional(),
  value: z.number().default(0),
  weight: z.string(),
});

type IItem = z.infer<typeof itemZodSchema>;

export { IItem, itemZodSchema };
