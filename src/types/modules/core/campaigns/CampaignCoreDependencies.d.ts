import { CreateCampaignOperationContract, CreateCampaignServiceContract } from './campaigns/CreateCampaign';

import { GetCampaignByIdOperationContract, GetCampaignByIdServiceContract } from './campaigns/GetCampaignById';

import { UpdateCampaignOperationContract, UpdateCampaignServiceContract } from './campaigns/UpdateCampaign';

import {
    UpdateMatchMapImagesOperationContract,
    UpdateMatchMapImagesServiceContract,
} from './campaigns/UpdateMatchMapImages';

import { UpdateMatchMusicsOperationContract, UpdateMatchMusicsServiceContract } from './campaigns/UpdateMatchMapMusics';

import { updateMatchDateOperationContract, updateMatchDateServiceContract } from './campaigns/UpdateMatchDate';

import { PublishmentOperationContract, PublishmentServiceContract } from './campaigns/publishment';

import {
    RemoveCampaignPlayersOperationContract,
    RemoveCampaignPlayersServiceContract,
} from './campaigns/RemoveCampaignPlayers';

import { AddCampaignPlayersOperationContract, AddCampaignPlayersServiceContract } from './campaigns/AddCampaignPlayers';

import {
    UpdateCampaignImagesOperationContract,
    UpdateCampaignImagesServiceContract,
} from './campaigns/UpdateCampaignImages';

import {
    PostInvitationEmailOperationContract,
    PostInvitationEmailServiceContract,
} from './campaigns/PostInvitationEmail';

import { PostBanPlayerOperationContract, PostBanPlayerServiceContract } from './campaigns/PostBanPlayer';

import { AddPlayerCharacterOperationContract, AddPlayerCharacterServiceContract } from './campaigns/AddPlayerCharacter';
import {
    GetCampaignCharactersOperationContract,
    GetCampaignCharactersServiceContract,
} from './campaigns/GetCampaignCharacters';
import {
    RemovePlayerCharacterOperationContract,
    RemovePlayerCharacterServiceContract,
} from './campaigns/RemovePlayerCharacter';
import {
    GetCharactersByPlayerOperationContract,
    GetCharactersByPlayerServiceContract,
} from './campaigns/GetCharactersByPlayer';

import {
    UpdateCampaignPlayerLimitOperationContract,
    UpdateCampaignPlayerLimitServiceContract,
} from './campaigns/UpdateCampaignPlayerLimit';

import {
    ConfirmMatchPlayerPresenceOperationContract,
    ConfirmMatchPlayerPresenceServiceContract,
} from './campaigns/ConfirmMatchPlayerPresence';
import {
    ConfirmCampaignPlayerOperationContract,
    ConfirmCampaignPlayerServiceContract,
} from './campaigns/ConfirmCampaignPlayer';

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
    removePlayerCharacterOperationContract: RemovePlayerCharacterOperationContract;
    getCampaignCharactersOperationContract: GetCampaignCharactersOperationContract;
    getCharactersByPlayerOperationContract: GetCharactersByPlayerOperationContract;
    postInvitationEmailOperationContract: PostInvitationEmailOperationContract;
    postBanPlayerOperationContract: PostBanPlayerOperationContract;
    updateCampaignImagesOperationContract: UpdateCampaignImagesOperationContract;
    updateCampaignPlayerLimitOperationContract: UpdateCampaignPlayerLimitOperationContract;
    confirmMatchPlayerPresenceOperationContract: ConfirmMatchPlayerPresenceOperationContract;
    confirmCampaignPlayerOperationContract: ConfirmCampaignPlayerOperationContract;

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
    removePlayerCharacterServiceContract: RemovePlayerCharacterServiceContract;
    getCampaignCharactersServiceContract: GetCampaignCharactersServiceContract;
    getCharactersByPlayerServiceContract: GetCharactersByPlayerServiceContract;
    postInvitationEmailServiceContract: PostInvitationEmailServiceContract;
    postBanPlayerServiceContract: PostBanPlayerServiceContract;
    updateCampaignImagesServiceContract: UpdateCampaignImagesServiceContract;
    updateCampaignPlayerLimitServiceContract: UpdateCampaignPlayerLimitServiceContract;
    confirmMatchPlayerPresenceServiceContract: ConfirmMatchPlayerPresenceServiceContract;
    confirmCampaignPlayerServiceContract: ConfirmCampaignPlayerServiceContract;
}
