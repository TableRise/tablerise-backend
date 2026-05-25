import AddEquipmentOperation from 'src/core/characters/operations/AddEquipmentOperation';
import CreateCharacterOperation from 'src/core/characters/operations/CreateCharacterOperation';
import DeleteCharacterOperation from 'src/core/characters/operations/DeleteCharacterOperation';
import GetAllCharactersOperation from 'src/core/characters/operations/GetAllCharactersOperation';
import GetCharacterByIdOperation from 'src/core/characters/operations/GetCharacterByIdOperation';
import OrgPictureUploadOperation from 'src/core/characters/operations/OrgPictureUploadOperation';
import RemoveEquipmentOperation from 'src/core/characters/operations/RemoveEquipmentOperation';
import UpdateCharacterOperation from 'src/core/characters/operations/UpdateCharacterOperation';
import UpdateCharacterPictureOperation from 'src/core/characters/operations/UpdateCharacterPictureOperation';
import UpdateCharacterMoneyOperation from 'src/core/characters/operations/UpdateCharacterMoneyOperation';

export interface CharactersControllerContract {
    createCharacterOperation: CreateCharacterOperation;
    getCharacterByIdOperation: GetCharacterByIdOperation;
    getAllCharactersOperation: GetAllCharactersOperation;
    updateCharacterPictureOperation: UpdateCharacterPictureOperation;
    orgPictureUploadOperation: OrgPictureUploadOperation;
    updateCharacterOperation: UpdateCharacterOperation;
    addEquipmentOperation: AddEquipmentOperation;
    removeEquipmentOperation: RemoveEquipmentOperation;
    updateCharacterMoneyOperation: UpdateCharacterMoneyOperation;
    deleteCharacterOperation: DeleteCharacterOperation;
}
