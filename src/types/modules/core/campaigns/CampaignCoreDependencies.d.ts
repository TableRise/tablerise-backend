import { CreateCampaignOperationContract, CreateCampaignServiceContract } from './campaigns/CreateCampaign';

import { GetCampaignByIdOperationContract, GetCampaignByIdServiceContract } from './campaigns/GetCampaignById';

import { UpdateCampaignOperationContract, UpdateCampaignServiceContract } from './campaigns/UpdateCampaign';

import {
    UpdateMatchMapImagesOperationContract,
    UpdateMatchMapImagesServiceContract,
} from './campaigns/UpdateMatchMapImages';
import { UpdateMatchImagesOperationContract, UpdateMatchImagesServiceContract } from './campaigns/UpdateMatchImages';
import {
    UpdateMatchHighlightedImageOperationContract,
    UpdateMatchHighlightedImageServiceContract,
} from './campaigns/UpdateMatchHighlightedImage';

import { UpdateMatchMusicsOperationContract, UpdateMatchMusicsServiceContract } from './campaigns/UpdateMatchMapMusics';

import { PublishmentOperationContract, PublishmentServiceContract } from './campaigns/publishment';
import { PostCampaignBuyOperationContract, PostCampaignBuyServiceContract } from './campaigns/PostCampaignBuy';

import {
    RemoveCampaignPlayersOperationContract,
    RemoveCampaignPlayersServiceContract,
} from './campaigns/RemoveCampaignPlayers';

import { AddCampaignPlayersOperationContract, AddCampaignPlayersServiceContract } from './campaigns/AddCampaignPlayers';

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
    ConfirmMatchPlayerPresenceOperationContract,
    ConfirmMatchPlayerPresenceServiceContract,
} from './campaigns/ConfirmMatchPlayerPresence';
import {
    ConfirmCampaignPlayerOperationContract,
    ConfirmCampaignPlayerServiceContract,
} from './campaigns/ConfirmCampaignPlayer';

import {
    UpdateCampaignCoverOperationContract,
    UpdateCampaignCoverServiceContract,
} from './campaigns/UpdateCampaignCover';

import {
    RemoveCampaignImageOperationContract,
    RemoveCampaignImageServiceContract,
} from './campaigns/RemoveCampaignImage';

import {
    TransferDungeonMasterOperationContract,
    TransferDungeonMasterServiceContract,
} from './campaigns/TransferDungeonMaster';
import {
    UpdateCampaignJournalHighlightOperationContract,
    UpdateCampaignJournalHighlightServiceContract,
} from './campaigns/UpdateCampaignJournalHighlight';
import {
    UpdateCampaignJournalPostOperationContract,
    UpdateCampaignJournalPostServiceContract,
} from './campaigns/UpdateCampaignJournalPost';
import {
    DeleteCampaignJournalPostOperationContract,
    DeleteCampaignJournalPostServiceContract,
} from './campaigns/DeleteCampaignJournalPost';
import {
    UpdateCampaignPlayerNoteOperationContract,
    UpdateCampaignPlayerNoteServiceContract,
} from './campaigns/UpdateCampaignPlayerNote';
import {
    RemoveCampaignPlayerNoteOperationContract,
    RemoveCampaignPlayerNoteServiceContract,
} from './campaigns/RemoveCampaignPlayerNote';
import { DeleteCampaignOperationContract, DeleteCampaignServiceContract } from './campaigns/DeleteCampaign';

export default interface CampaignCoreDependencies {
    // Operations
    deleteCampaignOperationContract: DeleteCampaignOperationContract;
    createCampaignOperationContract: CreateCampaignOperationContract;
    updateCampaignOperationContract: UpdateCampaignOperationContract;
    getCampaignByIdOperationContract: GetCampaignByIdOperationContract;
    publishmentOperationContract: PublishmentOperationContract;
    postCampaignBuyOperationContract: PostCampaignBuyOperationContract;
    updateMatchMapImagesOperationContract: UpdateMatchMapImagesOperationContract;
    updateMatchImagesOperationContract: UpdateMatchImagesOperationContract;
    updateMatchHighlightedImageOperationContract: UpdateMatchHighlightedImageOperationContract;
    updateMatchMusicsOperationContract: UpdateMatchMusicsOperationContract;
    addCampaignPlayersOperationContract: AddCampaignPlayersOperationContract;
    removeCampaignPlayersOperationContract: RemoveCampaignPlayersOperationContract;
    addPlayerCharacterOperationContract: AddPlayerCharacterOperationContract;
    removePlayerCharacterOperationContract: RemovePlayerCharacterOperationContract;
    getCampaignCharactersOperationContract: GetCampaignCharactersOperationContract;
    getCharactersByPlayerOperationContract: GetCharactersByPlayerOperationContract;
    confirmMatchPlayerPresenceOperationContract: ConfirmMatchPlayerPresenceOperationContract;
    confirmCampaignPlayerOperationContract: ConfirmCampaignPlayerOperationContract;
    updateCampaignCoverOperationContract: UpdateCampaignCoverOperationContract;
    removeCampaignImageOperationContract: RemoveCampaignImageOperationContract;
    transferDungeonMasterOperationContract: TransferDungeonMasterOperationContract;
    updateCampaignJournalHighlightOperationContract: UpdateCampaignJournalHighlightOperationContract;
    updateCampaignJournalPostOperationContract: UpdateCampaignJournalPostOperationContract;
    deleteCampaignJournalPostOperationContract: DeleteCampaignJournalPostOperationContract;
    updateCampaignPlayerNoteOperationContract: UpdateCampaignPlayerNoteOperationContract;
    removeCampaignPlayerNoteOperationContract: RemoveCampaignPlayerNoteOperationContract;

    // Services
    deleteCampaignServiceContract: DeleteCampaignServiceContract;
    createCampaignServiceContract: CreateCampaignServiceContract;
    updateCampaignServiceContract: UpdateCampaignServiceContract;
    getCampaignByIdServiceContract: GetCampaignByIdServiceContract;
    publishmentServiceContract: PublishmentServiceContract;
    postCampaignBuyServiceContract: PostCampaignBuyServiceContract;
    updateMatchMapImagesServiceContract: UpdateMatchMapImagesServiceContract;
    updateMatchImagesServiceContract: UpdateMatchImagesServiceContract;
    updateMatchHighlightedImageServiceContract: UpdateMatchHighlightedImageServiceContract;
    updateMatchMusicsServiceContract: UpdateMatchMusicsServiceContract;
    addCampaignPlayersServiceContract: AddCampaignPlayersServiceContract;
    removeCampaignPlayersServiceContract: RemoveCampaignPlayersServiceContract;
    addPlayerCharacterServiceContract: AddPlayerCharacterServiceContract;
    removePlayerCharacterServiceContract: RemovePlayerCharacterServiceContract;
    getCampaignCharactersServiceContract: GetCampaignCharactersServiceContract;
    getCharactersByPlayerServiceContract: GetCharactersByPlayerServiceContract;
    confirmMatchPlayerPresenceServiceContract: ConfirmMatchPlayerPresenceServiceContract;
    confirmCampaignPlayerServiceContract: ConfirmCampaignPlayerServiceContract;
    updateCampaignCoverServiceContract: UpdateCampaignCoverServiceContract;
    removeCampaignImageServiceContract: RemoveCampaignImageServiceContract;
    transferDungeonMasterServiceContract: TransferDungeonMasterServiceContract;
    updateCampaignJournalHighlightServiceContract: UpdateCampaignJournalHighlightServiceContract;
    updateCampaignJournalPostServiceContract: UpdateCampaignJournalPostServiceContract;
    deleteCampaignJournalPostServiceContract: DeleteCampaignJournalPostServiceContract;
    updateCampaignPlayerNoteServiceContract: UpdateCampaignPlayerNoteServiceContract;
    removeCampaignPlayerNoteServiceContract: RemoveCampaignPlayerNoteServiceContract;
}
