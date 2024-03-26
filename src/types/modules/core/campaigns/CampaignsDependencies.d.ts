import {
    GetCampaignByIdOperationContract,
    GetCampaignByIdServiceContract,
} from './GetCampaignById';

export default interface CampaignsDependencies {
    // operations
    getCampaignByIdOperationContract: GetCampaignByIdOperationContract;

    // services
    getCampaignByIdServiceContract: GetCampaignByIdServiceContract;
}
