import {
    CreateCampaignOperationContract,
    CreateCampaignServiceContract,
} from './campaigns/CreateCampaign';

import {
    GetCampaignByIdOperationContract,
    GetCampaignByIdServiceContract,
} from './campaigns/GetCampaignById';

import {
    UpdateMatchMapImagesOperationContract,
    UpdateMatchMapImagesServiceContract,
} from './campaigns/UpdateMatchMapImages';

export default interface CampaignCoreDependencies {
    // Operations
    createCampaignOperationContract: CreateCampaignOperationContract;
    getCampaignByIdOperationContract: GetCampaignByIdOperationContract;
    updateMatchMapImagesOperationContract: UpdateMatchMapImagesOperationContract;

    // Services
    createCampaignServiceContract: CreateCampaignServiceContract;
    getCampaignByIdServiceContract: GetCampaignByIdServiceContract;
    updateMatchMapImagesServiceContract: UpdateMatchMapImagesServiceContract;
}
