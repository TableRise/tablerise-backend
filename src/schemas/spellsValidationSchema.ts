import { z } from 'zod';

const damageZodSchema = z.object({
    type: z.string(),
    dice: z.string(),
});

const higherLevelsZodSchema = z.object({
    level: z.string(),
    damage: z.array(damageZodSchema),
    buffs: z.array(z.string()),
    debuffs: z.array(z.string()),
});

const spellZodSchema = z.object({
    active: z.boolean(),
    name: z.string(),
    description: z.string(),
    type: z.string(),
    level: z.number(),
    higherLevels: z.array(higherLevelsZodSchema),
    damage: z.array(damageZodSchema).or(z.null()),
    castingTime: z.string(),
    duration: z.string(),
    range: z.string(),
    components: z.string(),
    buffs: z.array(z.string()),
    debuffs: z.array(z.string()),
});

export type Spell = z.infer<typeof spellZodSchema>;
export type Damage = z.infer<typeof damageZodSchema>;
export type HigherLevels = z.infer<typeof higherLevelsZodSchema>;

export default spellZodSchema;
