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

import {
    UpdateMatchDatesOperationContract,
    UpdateMatchDatesServiceContract,
} from './campaigns/UpdateMatchDates';

import {
    PublishPostOperationContract,
    PublishPostServiceContract,
} from './campaigns/PublishPost';

import {
    UpdateMatchPlayersOperationContract,
    UpdateMatchPlayersServiceContract,
} from './campaigns/UpdateMatchPlayers';

export default interface CampaignCoreDependencies {
    // Operations
    createCampaignOperationContract: CreateCampaignOperationContract;
    updateCampaignOperationContract: UpdateCampaignOperationContract;
    getCampaignByIdOperationContract: GetCampaignByIdOperationContract;
    publishPostOperationContract: PublishPostOperationContract;
    updateMatchMapImagesOperationContract: UpdateMatchMapImagesOperationContract;
    updateMatchMusicsOperationContract: UpdateMatchMusicsOperationContract;
    updateMatchDatesOperationContract: UpdateMatchDatesOperationContract;
    updateMatchPlayersOperationContract: UpdateMatchPlayersOperationContract;

    // Services
    createCampaignServiceContract: CreateCampaignServiceContract;
    updateCampaignServiceContract: UpdateCampaignServiceContract;
    getCampaignByIdServiceContract: GetCampaignByIdServiceContract;
    publishPostServiceContract: PublishPostServiceContract;
    updateMatchMapImagesServiceContract: UpdateMatchMapImagesServiceContract;
    updateMatchMusicsServiceContract: UpdateMatchMusicsServiceContract;
    updateMatchDatesServiceContract: UpdateMatchDatesServiceContract;
    updateMatchPlayersServiceContract: UpdateMatchPlayersServiceContract;
}
