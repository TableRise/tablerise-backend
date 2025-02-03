import {
    CreateCharacterOperationContract,
    CreateCharacterServiceContract,
} from './characters/CreateCharacter';
import {
    RecoverCharacterByCampaignOperationContract,
    RecoverCharacterByCampaignServiceContract
} from './characters/RecoverCharacterByCampaign';

export default interface CharacterCoreDependencies {
    // Operations
    createCharacterOperationContract: CreateCharacterOperationContract;
    recoverCharacterByCampaignOperationContract: RecoverCharacterByCampaignOperationContract;

    // Service
    createCharacterServiceContract: CreateCharacterServiceContract;
    recoverCharacterByCampaignServiceContract: RecoverCharacterByCampaignServiceContract;
}
