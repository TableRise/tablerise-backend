import { z } from 'zod';

const campaignsRemoveCampaignPlayersZodSchema = z.object({
    campaignId: z.string(),
    characterId: z.string().optional(),
    userId: z.string(),
});

export type CampaignRemovePayload = z.infer<typeof campaignsRemoveCampaignPlayersZodSchema>;
export default campaignsRemoveCampaignPlayersZodSchema;
