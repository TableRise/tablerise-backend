import { z } from 'zod';

const campaignsPostZodSchema = z.object({
    title: z.string(),
    content: z.string().max(250),
});

export type CampaignsPostPayload = z.infer<typeof campaignsPostZodSchema>;
export default campaignsPostZodSchema;
