import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';

export interface UpdateTimestampPayload {
    campaignId?: string;
}

export interface __CampaignWithID extends Campaign {
    campaignId: string;
}

export interface __FullCampaign extends Campaign {
    visibility?: string;
    cover?: ImageObject;
    lore?: string;
    nextMatchDate?: string;
    playerAmountLimite?: number;
}

export interface __CampaignEnriched extends Campaign {
    cover?: ImageObject;
}

export interface __CampaignSerialized extends Campaign {}

export interface __CampaignSaved extends Campaign {}
