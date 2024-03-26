import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';

export interface UpdateTimestampPayload {
    campaignId?: string;
}

export interface __CampaignWithID extends CampaignInstance {
    campaignId: string;
}

export interface __FullCampaign extends CampaignInstance {}

export interface __CampaignEnriched extends CampaignInstance {}

export interface __CampaignSerialized extends CampaignInstance {}

export interface __CampaignSaved extends CampaignInstance {}
