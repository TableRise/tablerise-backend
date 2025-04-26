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
    updateMatchDateOperationContract,
    updateMatchDateServiceContract,
} from './campaigns/UpdateMatchDate';

import {
    PublishmentOperationContract,
    PublishmentServiceContract,
} from './campaigns/publishment';

import {
    RemoveCampaignPlayersOperationContract,
    RemoveCampaignPlayersServiceContract,
} from './campaigns/RemoveCampaignPlayers';

import {
    AddCampaignPlayersOperationContract,
    AddCampaignPlayersServiceContract,
} from './campaigns/AddCampaignPlayers';

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

import {
    GetCampaignsByUserIdOperationContract,
    GetCampaignsByUserIdServiceContract,
} from './campaigns/GetCampaignByUserId';

export default interface CampaignCoreDependencies {
    // Operations
    createCampaignOperationContract: CreateCampaignOperationContract;
    updateCampaignOperationContract: UpdateCampaignOperationContract;
    getCampaignByIdOperationContract: GetCampaignByIdOperationContract;
    publishmentOperationContract: PublishmentOperationContract;
    updateMatchMapImagesOperationContract: UpdateMatchMapImagesOperationContract;
    updateMatchMusicsOperationContract: UpdateMatchMusicsOperationContract;
    updateMatchDateOperationContract: updateMatchDateOperationContract;
    addCampaignPlayersOperationContract: AddCampaignPlayersOperationContract;
    removeCampaignPlayersOperationContract: RemoveCampaignPlayersOperationContract;
    addPlayerCharacterOperationContract: AddPlayerCharacterOperationContract;
    postInvitationEmailOperation: PostInvitationEmailOperation;
    postBanPlayerOperation: PostBanPlayerOperation;
    updateCampaignImagesOperationContract: UpdateCampaignImagesOperationContract;
    getCampaignsByUserIdOperationContract: GetCampaignsByUserIdOperationContract;

    // Services
    createCampaignServiceContract: CreateCampaignServiceContract;
    updateCampaignServiceContract: UpdateCampaignServiceContract;
    getCampaignByIdServiceContract: GetCampaignByIdServiceContract;
    publishmentServiceContract: PublishmentServiceContract;
    updateMatchMapImagesServiceContract: UpdateMatchMapImagesServiceContract;
    updateMatchMusicsServiceContract: UpdateMatchMusicsServiceContract;
    updateMatchDateServiceContract: updateMatchDateServiceContract;
    addCampaignPlayersServiceContract: AddCampaignPlayersServiceContract;
    removeCampaignPlayersServiceContract: RemoveCampaignPlayersServiceContract;
    addPlayerCharacterServiceContract: AddPlayerCharacterServiceContract;
    postInvitationEmailServiceContract: PostInvitationEmailServiceContract;
    postBanPlayerServiceContract: PostBanPlayerServiceContract;
    updateCampaignImagesServiceContract: UpdateCampaignImagesServiceContract;
    getCampaignsByUserIdServiceContract: GetCampaignsByUserIdServiceContract;
}
