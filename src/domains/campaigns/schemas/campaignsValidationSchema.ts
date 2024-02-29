import { z } from 'zod';

const campaignsZodSchema = z.object({
    title: z.string(),
});

export type CampaignPayload = z.infer<typeof campaignsZodSchema>;
export type CampaignInstance = z.infer<typeof campaignsZodSchema> & {
    campaignId: string;
    title: string;
};

export default campaignsZodSchema;
