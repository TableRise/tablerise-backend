import { z } from 'zod';

const characterZodSchema = z.object({
  _id: z.string().optional(),
  player_id: z.string().length(24),
  campaign_id: z.string().length(24),
  name: z.string().min(3),
  race_id: z.string().length(24),
  class_id: z.string().length(24),
  background_id: z.string().length(24),
  alignment: z.enum([
    'leal-e-bom',
    'neutro-e-bom',
    'caótico-e-bom',
    'leal-e-neutro',
    'neutro',
    'caótico-e-neutro',
    'leal-e-mau',
    'neutro-e-mau',
    'caótico-e-mau'
  ]),
  alignment_story_details: z.string(),
  experience: z.number().default(0),
  level: z.number().default(0),
  inspiration_bonus: z.number().default(0),
  proficience_bonus: z.number().default(0),
  saving_throws: z.object({
    strength: z.object({
      active: z.boolean(),
      value: z.number().default(0)
    }),
    dexterity: z.object({
      active: z.boolean(),
      value: z.number().default(0)
    }),
    constitution: z.object({
      active: z.boolean(),
      value: z.number().default(0)
    }),
    intelligence: z.object({
      active: z.boolean(),
      value: z.number().default(0)
    }),
    wisdom: z.object({
      active: z.boolean(),
      value: z.number().default(0)
    }),
    charisma: z.object({
      active: z.boolean(),
      value: z.number().default(0)
    })
  }),
  skills: z.object({
    athletics: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    acrobatics: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    sleightOfHand: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    stealth: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    arcana: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    history: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    investigation: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    nature: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    religion: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    animalHandling: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    insight: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    medicine: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    perception: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    survival: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    deception: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    intimidation: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    performance: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    }),
    persuasion: z.object({
      active: z.boolean(),
      value: z.number().default(0),
      ability: z.string()
    })
  }),
  ability_scores: z.object({
    strength: z.object({
      value: z.number().default(0),
      modifier: z.number().default(0)
    }),
    dexterity: z.object({
      value: z.number().default(0),
      modifier: z.number().default(0)
    }),
    constitution: z.object({
      value: z.number().default(0),
      modifier: z.number().default(0)
    }),
    intelligence: z.object({
      value: z.number().default(0),
      modifier: z.number().default(0)
    }),
    wisdom: z.object({
      value: z.number().default(0),
      modifier: z.number().default(0)
    }),
    charisma: z.object({
      value: z.number().default(0),
      modifier: z.number().default(0)
    })
  }),
  passive_wisdom: z.number().default(0),
  languages: z.enum([
    'Anão',
    'Comum',
    'Élfico',
    'Gigante',
    'Gnômico',
    'Goblin',
    'Halfling',
    'Orc',
    'Abissal',
    'Celestial',
    'Dialeto Subterrâneo',
    'Dracônico',
    'Infernal',
    'Primordial',
    'Silvestre',
    'Subcomum'
  ]),
  extra_proficiences: z.object({
    name: z.string(),
    description: z.string()
  }),
  armor_class: z.number().default(0),
  initiative: z.number().default(0),
  speed: z.number().default(0),
  hit_points: z.number().default(0),
  actual_hit_points: z.number().default(0),
  temp_hit_points: z.number().default(0),
  attacks: z.array(z.string().length(24)),
  spells: z.array(z.string().length(24)),
  equipment_id: z.string().length(24),
  characteristics_abilities: z.string(),
  age: z.string(),
  eyes: z.string(),
  height: z.string(),
  skin: z.string(),
  weight: z.string(),
  hair: z.string(),
  aliances: z.string(),
  appearance: z.string(),
  history: z.string(),
  teasures: z.array(z.object({
    name: z.string(),
    description: z.string().optional()
  }))
});

type ICharacter = z.infer<typeof characterZodSchema>;

export { type ICharacter, characterZodSchema };
