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
    RemoveMatchPlayersOperationContract,
    RemoveMatchPlayersServiceContract,
} from './campaigns/RemoveMatchPlayers';

import {
    AddMatchPlayersOperationContract,
    AddMatchPlayersServiceContract,
} from './campaigns/AddMatchPlayers';

import {
    UpdateCampaignImagesOperationContract,
    UpdateCampaignImagesServiceContract,
} from './campaigns/UpdateCampaignImages';

import {
    PostInvitationEmailOperation,
    PostInvitationEmailServiceContract,
} from './campaigns/PostInvitationEmail';

import {
    PostBanPlayerOperation,
    PostBanPlayerServiceContract,
} from './campaigns/PostBanPlayerOperation';

import {
    AddPlayerCharacterOperationContract,
    AddPlayerCharacterServiceContract,
} from './campaigns/AddPlayerCharacter';

export default interface CampaignCoreDependencies {
    // Operations
    createCampaignOperationContract: CreateCampaignOperationContract;
    updateCampaignOperationContract: UpdateCampaignOperationContract;
    getCampaignByIdOperationContract: GetCampaignByIdOperationContract;
    publishmentOperationContract: PublishmentOperationContract;
    updateMatchMapImagesOperationContract: UpdateMatchMapImagesOperationContract;
    updateMatchMusicsOperationContract: UpdateMatchMusicsOperationContract;
    updateMatchDatesOperationContract: UpdateMatchDatesOperationContract;
    addMatchPlayersOperationContract: AddMatchPlayersOperationContract;
    removeMatchPlayersOperationContract: RemoveMatchPlayersOperationContract;
    addPlayerCharacterOperationContract: AddPlayerCharacterOperationContract;
    postInvitationEmailOperation: PostInvitationEmailOperation;
    postBanPlayerOperation: PostBanPlayerOperation;
    updateCampaignImagesOperationContract: UpdateCampaignImagesOperationContract;

    // Services
    createCampaignServiceContract: CreateCampaignServiceContract;
    updateCampaignServiceContract: UpdateCampaignServiceContract;
    getCampaignByIdServiceContract: GetCampaignByIdServiceContract;
    publishmentServiceContract: PublishmentServiceContract;
    updateMatchMapImagesServiceContract: UpdateMatchMapImagesServiceContract;
    updateMatchMusicsServiceContract: UpdateMatchMusicsServiceContract;
    updateMatchDatesServiceContract: UpdateMatchDatesServiceContract;
    addMatchPlayersServiceContract: AddMatchPlayersServiceContract;
    removeMatchPlayersServiceContract: RemoveMatchPlayersServiceContract;
    addPlayerCharacterServiceContract: AddPlayerCharacterServiceContract;
    postInvitationEmailServiceContract: PostInvitationEmailServiceContract;
    postBanPlayerServiceContract: PostBanPlayerServiceContract;
    updateCampaignImagesServiceContract: UpdateCampaignImagesServiceContract;
}
