import {
    CreateCampaignOperationContract,
    CreateCampaignServiceContract,
} from './campaigns/CreateCampaign';

export default interface CampaignCoreDependencies {
    // Operations
    createCampaignOperationContract: CreateCampaignOperationContract;

    // Services
    createCampaignServiceContract: CreateCampaignServiceContract;
}
