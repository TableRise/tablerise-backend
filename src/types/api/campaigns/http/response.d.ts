import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';

export interface CreateCampaignResponse extends CampaignInstance {}

export interface GetAllCampaignsResponse {
    title;
    cover;
    description;
    playersAmount: campaignPlayers.length;
    ageRestriction;
    updatedAt;
}

export interface GetCampaignByUserIdResponse {
    master: CampaignInstance[];
    player: CampaignInstance[];
}
