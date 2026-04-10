import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';

export interface CreateCampaignResponse extends Campaign {}

export interface GetAllCampaignsResponse {
    title;
    cover;
    description;
    playersAmount: campaignPlayers.length;
    ageRestriction;
    updatedAt;
}

export interface GetCampaignByUserIdResponse {
    master: Campaign[];
    player: Campaign[];
}
