import { ZodString, z } from 'zod';

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
    youtube: z.string().optional(),
  }).optional(),
  player_campaigns: z.array(z.object({
    campaign_id: z.string().length(16),
    active: z.boolean(),
    master: z.boolean(),
    character: z.string().length(16),
  })),
});

type IAccount = z.infer<typeof accountZodSchema>;

export { IAccount, accountZodSchema }
