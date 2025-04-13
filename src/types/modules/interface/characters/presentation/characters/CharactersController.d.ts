import CreateCharacterOperation from 'src/core/characters/operations/CreateCharacterOperation';
import GetAllCharactersOperation from 'src/core/characters/operations/GetAllCharactersOperation';
import GetCharacterByIdOperation from 'src/core/characters/operations/GetCharacterByIdOperation';
import OrgPictureUploadOperation from 'src/core/characters/operations/OrgPictureUploadOperation';
import RecoverCharacterByCampaignOperation from 'src/core/characters/operations/RecoverCharacterByCampaignOperation';
import UpdateCharacterPictureOperation from 'src/core/characters/operations/UpdateCharacterPictureOperation';

export interface CharactersControllerContract {
    createCharacterOperation: CreateCharacterOperation;
    getCharacterByIdOperation: GetCharacterByIdOperation;
    getAllCharactersOperation: GetAllCharactersOperation;
    recoverCharacterByCampaignOperation: RecoverCharacterByCampaignOperation;
    updateCharacterPictureOperation: UpdateCharacterPictureOperation;
    orgPictureUploadOperation: OrgPictureUploadOperation;
}
