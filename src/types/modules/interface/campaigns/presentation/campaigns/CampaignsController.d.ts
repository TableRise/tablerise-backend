import GetCampaignByIdOperation from 'src/core/campaigns/operations/campaigns/GetCampaignByIdOperation';
import createCampaignOperation from 'src/core/campaigns/operations/campaigns/CreateCampaignOperation';
import GetAllCampaignsOperation from 'src/core/campaigns/operations/campaigns/GetAllCampaignsOperation';
import UpdateMatchMapImagesOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchMapImagesOperation';
import UpdateMatchMusicsOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchMusicsOperation';
import UpdateCampaignOperation from 'src/core/campaigns/operations/campaigns/UpdateCampaignOperation';
import UpdateMatchDatesOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchDatesOperation';

export interface CampaignsControllerContract {
    getAllCampaignsOperation: GetAllCampaignsOperation;
    getCampaignByIdOperation: GetCampaignByIdOperation;
    createCampaignOperation: createCampaignOperation;
    updateCampaignOperation: UpdateCampaignOperation;
    updateMatchMapImagesOperation: UpdateMatchMapImagesOperation;
    updateMatchMusicsOperation: UpdateMatchMusicsOperation;
    updateMatchDatesOperation: UpdateMatchDatesOperation;
}
