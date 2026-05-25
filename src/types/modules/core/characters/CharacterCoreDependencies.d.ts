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
import { DeleteCharacterOperationContract, DeleteCharacterServiceContract } from './characters/DeleteCharacter';
import UpdateCharacterMoneyOperation from 'src/core/characters/operations/UpdateCharacterMoneyOperation';
import UpdateCharacterMoneyService from 'src/core/characters/services/UpdateCharacterMoneyService';

export interface UpdateCharacterMoneyOperationContract {
    updateCharacterMoneyService: UpdateCharacterMoneyService;
    logger: Logger;
}

export interface UpdateCharacterMoneyServiceContract {
    charactersRepository: CharactersRepository;
    logger: Logger;
}

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
    updateCharacterMoneyOperationContract: UpdateCharacterMoneyOperationContract;
    deleteCharacterOperationContract: DeleteCharacterOperationContract;

    // Service
    createCharacterServiceContract: CreateCharacterServiceContract;
    getAllCharactersServiceContract: GetAllCharactersServiceContract;
    getCharacterByIdServiceContract: GetCharacterByIdServiceContract;
    updateCharacterPictureOperationService: UpdateCharacterPictureOperationService;
    orgPictureUploadServiceContract: OrgPictureUploadServiceContract;
    updateCharacterServiceContract: UpdateCharacterServiceContract;
    addEquipmentServiceContract: AddEquipmentServiceContract;
    removeEquipmentServiceContract: RemoveEquipmentServiceContract;
    updateCharacterMoneyServiceContract: UpdateCharacterMoneyServiceContract;
    deleteCharacterServiceContract: DeleteCharacterServiceContract;
}
