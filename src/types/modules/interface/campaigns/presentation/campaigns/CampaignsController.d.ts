import GetCampaignByIdOperation from 'src/core/campaigns/operations/campaigns/GetCampaignByIdOperation';
import createCampaignOperation from 'src/core/campaigns/operations/campaigns/CreateCampaignOperation';
import GetAllCampaignsOperation from 'src/core/campaigns/operations/campaigns/GetAllCampaignsOperation';
import UpdateMatchMapImagesOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchMapImagesOperation';
import UpdateMatchMusicsOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchMusicsOperation';
import UpdateCampaignOperation from 'src/core/campaigns/operations/campaigns/UpdateCampaignOperation';
import updateMatchDateOperation from 'src/core/campaigns/operations/campaigns/updateMatchDateOperation';
import PublishmentOperation from 'src/core/campaigns/operations/campaigns/PublishmentOperation';
import AddCampaignPlayersOperation from 'src/core/campaigns/operations/campaigns/AddCampaignPlayersOperation';
import RemoveCampaignPlayersOperation from 'src/core/campaigns/operations/campaigns/RemoveCampaignPlayersOperation';
import PostInvitationEmailOperation from 'src/core/campaigns/operations/PostInvitationEmailOperation';
import UpdateCampaignImagesOperation from 'src/core/campaigns/operations/UpdateCampaignImagesOperation';
import PostBanPlayerOperation from 'src/core/campaigns/operations/PostBanPlayerOperation';
import AddPlayerCharacterOperation from 'src/core/campaigns/operations/AddPlayerCharacterOperation';
import GetCampaignsByUserIdOperation from 'src/core/campaigns/operations/GetCampaignsByUserIdOperation';
import UpdateCampaignPlayerLimitOperation from 'src/core/campaigns/operations/UpdateCampaignPlayerLimitOperation';
import ConfirmMatchPlayerPresenceOperation from 'src/core/campaigns/operations/ConfirmMatchPlayerPresenceOperation';

export interface CampaignsControllerContract {
    getAllCampaignsOperation: GetAllCampaignsOperation;
    getCampaignByIdOperation: GetCampaignByIdOperation;
    publishmentOperation: PublishmentOperation;
    createCampaignOperation: createCampaignOperation;
    updateCampaignOperation: UpdateCampaignOperation;
    updateMatchMapImagesOperation: UpdateMatchMapImagesOperation;
    updateMatchMusicsOperation: UpdateMatchMusicsOperation;
    updateMatchDateOperation: updateMatchDateOperation;
    addCampaignPlayersOperation: AddCampaignPlayersOperation;
    removeCampaignPlayersOperation: RemoveCampaignPlayersOperation;
    getCampaignsByUserIdOperation: GetCampaignsByUserIdOperation;
    addPlayerCharacterOperation: AddPlayerCharacterOperation;
    postInvitationEmailOperation: PostInvitationEmailOperation;
    postBanPlayerOperation: PostBanPlayerOperation;
    updateCampaignImagesOperation: UpdateCampaignImagesOperation;
    updateCampaignPlayerLimitOperation: UpdateCampaignPlayerLimitOperation;
    confirmMatchPlayerPresenceOperation: ConfirmMatchPlayerPresenceOperation;
}
