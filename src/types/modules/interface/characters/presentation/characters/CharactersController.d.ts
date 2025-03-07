import CreateCharacterOperation from 'src/core/characters/operations/CreateCharacterOperation';
import RecoverCharacterByCampaignOperation from 'src/core/characters/operations/RecoverCharacterByCampaignOperation';

export interface CharactersControllerContract {
    createCharacterOperation: CreateCharacterOperation;
    recoverCharacterByCampaignOperation: RecoverCharacterByCampaignOperation;
}
