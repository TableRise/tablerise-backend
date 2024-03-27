import GetCampaignByIdOperation from 'src/core/campaigns/operations/campaigns/GetCampaignByIdOperation';
import createCampaignOperation from 'src/core/campaigns/operations/campaigns/CreateCampaignOperation';
import UpdateMatchMapImagesOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchMapImagesOperation';
import UpdateMatchMusicsOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchMusicsOperation';

export interface CampaignsControllerContract {
    getCampaignByIdOperation: GetCampaignByIdOperation;
    createCampaignOperation: createCampaignOperation;
    updateMatchMapImagesOperation: UpdateMatchMapImagesOperation;
    updateMatchMusicsOperation: UpdateMatchMusicsOperation;
}
