import {
    CreateCampaignOperationContract,
    CreateCampaignServiceContract,
} from './campaigns/CreateCampaign';

import {
    GetCampaignByIdOperationContract,
    GetCampaignByIdServiceContract,
} from './campaigns/GetCampaignById';

import {
    UpdateCampaignOperationContract,
    UpdateCampaignServiceContract,
} from './campaigns/UpdateCampaign';

import {
    UpdateMatchMapImagesOperationContract,
    UpdateMatchMapImagesServiceContract,
} from './campaigns/UpdateMatchMapImages';

import {
    UpdateMatchMusicsOperationContract,
    UpdateMatchMusicsServiceContract,
} from './campaigns/UpdateMatchMapMusics';

export default interface CampaignCoreDependencies {
    // Operations
    createCampaignOperationContract: CreateCampaignOperationContract;
    updateCampaignOperationContract: UpdateCampaignOperationContract;
    getCampaignByIdOperationContract: GetCampaignByIdOperationContract;
    updateMatchMapImagesOperationContract: UpdateMatchMapImagesOperationContract;
    updateMatchMusicsOperationContract: UpdateMatchMusicsOperationContract;

    // Services
    createCampaignServiceContract: CreateCampaignServiceContract;
    updateCampaignServiceContract: UpdateCampaignServiceContract;
    getCampaignByIdServiceContract: GetCampaignByIdServiceContract;
    updateMatchMapImagesServiceContract: UpdateMatchMapImagesServiceContract;
    updateMatchMusicsServiceContract: UpdateMatchMusicsServiceContract;
}
