import CreateCharacterOperation from 'src/core/characters/operations/CreateCharacterOperation';
import GetAllCharactersOperation from 'src/core/characters/operations/GetAllCharactersOperation';
import GetCharacterByIdOperation from 'src/core/characters/operations/GetCharacterByIdOperation';
import OrgPictureUploadOperation from 'src/core/characters/operations/OrgPictureUploadOperation';
import RecoverCharacterByCampaignOperation from 'src/core/characters/operations/RecoverCharacterByCampaignOperation';
import UpdateCharacterOperation from 'src/core/characters/operations/UpdateCharacterOperation';

export interface CharactersControllerContract {
    createCharacterOperation: CreateCharacterOperation;
    getCharacterByIdOperation: GetCharacterByIdOperation;
    getAllCharactersOperation: GetAllCharactersOperation;
    recoverCharacterByCampaignOperation: RecoverCharacterByCampaignOperation;
    orgPictureUploadOperation: OrgPictureUploadOperation;
    updateCharacterOperation: UpdateCharacterOperation;
}
