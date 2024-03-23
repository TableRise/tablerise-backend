import GetCampaignByIdOperation from 'src/core/campaigns/operations/campaigns/GetCampaignByIdOperation';
import createCampaignOperation from 'src/core/campaigns/operations/campaigns/CreateCampaignOperation';

export interface CampaignsControllerContract {
    getCampaignByIdOperation: GetCampaignByIdOperation;
    createCampaignOperation: createCampaignOperation;
    updateMatchMapImagesOperation: any;
}
