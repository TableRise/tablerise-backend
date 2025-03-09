import CreateCharacterOperation from 'src/core/characters/operations/CreateCharacterOperation';
import GetAllCharactersOperation from 'src/core/characters/operations/GetAllCharactersOperation';
import GetCharacterByIdOperation from 'src/core/characters/operations/GetCharacterByIdOperation';
import RecoverCharacterByCampaignOperation from 'src/types/modules/core/characters/characters/RecoverCharacterByCampaign';

export interface CharactersControllerContract {
    createCharacterOperation: CreateCharacterOperation;
    getCharacterByIdOperation: GetCharacterByIdOperation;
    getAllCharactersOperation: GetAllCharactersOperation;
    recoverCharacterByCampaignOperation: RecoverCharacterByCampaignOperation;
}
