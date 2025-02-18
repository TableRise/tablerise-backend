import CreateCharacterOperation from 'src/core/characters/operations/CreateCharacterOperation';
import GetAllCharactersOperation from 'src/core/characters/operations/GetAllCharactersOperation';
import  RecoverCharacterByCampaignOperation from 'src/types/modules/core/characters/characters/RecoverCharacterByCampaign';

export interface CharactersControllerContract {
    createCharacterOperation: CreateCharacterOperation;
    getAllCharactersOperation: GetAllCharactersOperation;
    recoverCharacterByCampaignOperation: RecoverCharacterByCampaignOperation;
}
