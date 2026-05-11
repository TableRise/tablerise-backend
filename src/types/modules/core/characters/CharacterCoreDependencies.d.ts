import {
    CreateCharacterOperationContract,
    CreateCharacterServiceContract,
    GetCharacterByIdOperationContract,
    GetCharacterByIdServiceContract,
    GetAllCharactersOperationContractract,
    GetAllCharactersServiceContract,
} from './characters/CreateCharacter';

import {
    UpdateCharacterPictureOperationContract,
    UpdateCharacterPictureOperationService,
} from './characters/UpdateCharacterPicture';
import { OrgPictureUploadOperationContract, OrgPictureUploadServiceContract } from './characters/OrganizationPicture';
import { UpdateCharacterOperationContract, UpdateCharacterServiceContract } from './characters/UpdateCharacter';
import {
    AddEquipmentOperationContract,
    AddEquipmentServiceContract,
    RemoveEquipmentOperationContract,
    RemoveEquipmentServiceContract,
} from './characters/ManageEquipment';

export default interface CharacterCoreDependencies {
    // Operations
    createCharacterOperationContract: CreateCharacterOperationContract;
    getAllCharactersOperationContract: GetAllCharactersOperationContractract;
    getCharacterByIdOperationContract: GetCharacterByIdOperationContract;
    updateCharacterPictureOperationContract: UpdateCharacterPictureOperationContract;
    orgPictureUploadOperationContract: OrgPictureUploadOperationContract;
    updateCharacterOperationContract: UpdateCharacterOperationContract;
    addEquipmentOperationContract: AddEquipmentOperationContract;
    removeEquipmentOperationContract: RemoveEquipmentOperationContract;

    // Service
    createCharacterServiceContract: CreateCharacterServiceContract;
    getAllCharactersServiceContract: GetAllCharactersServiceContract;
    getCharacterByIdServiceContract: GetCharacterByIdServiceContract;
    updateCharacterPictureOperationService: UpdateCharacterPictureOperationService;
    orgPictureUploadServiceContract: OrgPictureUploadServiceContract;
    updateCharacterServiceContract: UpdateCharacterServiceContract;
    addEquipmentServiceContract: AddEquipmentServiceContract;
    removeEquipmentServiceContract: RemoveEquipmentServiceContract;
}
