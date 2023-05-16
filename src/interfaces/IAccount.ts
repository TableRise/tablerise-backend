import { z } from 'zod';

const accountZodSchema = z.object({
  name: z.string(),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{1,16}$/),
  bio: z.string(),
  picture: z.string(),
  social_media: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    youtube: z.string().optional()
  }).optional(),
  player_campaigns: z.array(z.object({
    campaign_id: z.string().length(24),
    active: z.boolean(),
    master: z.boolean(),
    character_id: z.string().length(24)
  }))
});

type IAccount = z.infer<typeof accountZodSchema>;

export { type IAccount, accountZodSchema }
