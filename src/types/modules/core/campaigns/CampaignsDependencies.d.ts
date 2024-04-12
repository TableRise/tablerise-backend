import {
    GetCampaignByIdOperationContract,
    GetCampaignByIdServiceContract,
} from './GetCampaignById';
import {
    GetAllCampaignsOperationContract,
    GetAllCampaignsServiceContract,
} from './GetAllCampaigns';

export default interface CampaignsDependencies {
    // operations
    getAllCampaignsOperationContract: GetAllCampaignsOperationContract;
    getCampaignByIdOperationContract: GetCampaignByIdOperationContract;

    // services
    getAllCampaignsServiceContract: GetAllCampaignsServiceContract;
    getCampaignByIdServiceContract: GetCampaignByIdServiceContract;
}
