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
    PublishmentOperationContract,
    PublishmentServiceContract,
} from './campaigns/publishment';

import {
    UpdateMatchPlayersOperationContract,
    UpdateMatchPlayersServiceContract,
} from './campaigns/UpdateMatchPlayers';
import {
    UpdateCampaignImagesOperationContract,
    UpdateCampaignImagesServiceContract,
} from './campaigns/UpdateCampaignImages';

import {
    PostInvitationEmailOperation,
    PostInvitationEmailServiceContract,
} from './campaigns/PostInvitationEmail';

export default interface CampaignCoreDependencies {
    // Operations
    createCampaignOperationContract: CreateCampaignOperationContract;
    updateCampaignOperationContract: UpdateCampaignOperationContract;
    getCampaignByIdOperationContract: GetCampaignByIdOperationContract;
    publishmentOperationContract: PublishmentOperationContract;
    updateMatchMapImagesOperationContract: UpdateMatchMapImagesOperationContract;
    updateMatchMusicsOperationContract: UpdateMatchMusicsOperationContract;
    updateMatchDatesOperationContract: UpdateMatchDatesOperationContract;
    updateMatchPlayersOperationContract: UpdateMatchPlayersOperationContract;
    postInvitationEmailOperation: PostInvitationEmailOperation;
    updateCampaignImagesOperationContract: UpdateCampaignImagesOperationContract;

    // Services
    createCampaignServiceContract: CreateCampaignServiceContract;
    updateCampaignServiceContract: UpdateCampaignServiceContract;
    getCampaignByIdServiceContract: GetCampaignByIdServiceContract;
    publishmentServiceContract: PublishmentServiceContract;
    updateMatchMapImagesServiceContract: UpdateMatchMapImagesServiceContract;
    updateMatchMusicsServiceContract: UpdateMatchMusicsServiceContract;
    updateMatchDatesServiceContract: UpdateMatchDatesServiceContract;
    updateMatchPlayersServiceContract: UpdateMatchPlayersServiceContract;
    postInvitationEmailServiceContract: PostInvitationEmailServiceContract;
    updateCampaignImagesServiceContract: UpdateCampaignImagesServiceContract;
}
