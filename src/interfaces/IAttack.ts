import { z } from 'zod';

const attackZodSchema = z.object({
  system_id: z.string(),
  name: z.string(),
  range: z.string(),
  type: z.enum([
    'fisíco',
    'mágico'
  ]),
  damage: z.string(),
  damage_type: z.enum([
    'Perfurante',
    'Cortante',
    'Contundente',
    'Fogo',
    'Gelo',
    'Elétrico',
    'Ácido',
    'Venenoso',
    'Psíquico',
    'Radiante',
    'Necrótico',
    'Força',
    'Sônico',
    'Fome',
    'Luz Solar',
    'Trovão',
    'Vácuo',
    'Queda',
    'Ruptura',
    'Maldição',
    'Dreno'
  ]),
  tags: z.array(z.string()).optional(),
  description: z.string(),
  buffs: z.array(z.string()),
  debuffs: z.array(z.string()),
  requirements: z.array(z.string()),
  duration: z.string(),
  conjuration: z.string()
});

type IAttack = z.infer<typeof attackZodSchema>;

export { type IAttack, attackZodSchema };
