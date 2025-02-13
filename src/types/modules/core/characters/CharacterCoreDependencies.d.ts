import {
    CreateCharacterOperationContract,
    CreateCharacterServiceContract,
} from './characters/CreateCharacter';
import {
    RecoverCharacterByCampaignOperationContract,
    RecoverCharacterByCampaignServiceContract,
} from './characters/RecoverCharacterByCampaign';
import {
    UpdateCharacterPictureOperationContract,
    UpdateCharacterPictureOperationService,
} from './characters/UpdateCharacterPicture';

export default interface CharacterCoreDependencies {
    // Operations
    createCharacterOperationContract: CreateCharacterOperationContract;
    recoverCharacterByCampaignOperationContract: RecoverCharacterByCampaignOperationContract;
    updateCharacterPictureOperationContract: UpdateCharacterPictureOperationContract;

    // Service
    createCharacterServiceContract: CreateCharacterServiceContract;
    recoverCharacterByCampaignServiceContract: RecoverCharacterByCampaignServiceContract;
    updateCharacterPictureOperationService: UpdateCharacterPictureOperationService;
}
