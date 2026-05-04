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

export default interface CharacterCoreDependencies {
    // Operations
    createCharacterOperationContract: CreateCharacterOperationContract;
    getAllCharactersOperationContract: GetAllCharactersOperationContractract;
    getCharacterByIdOperationContract: GetCharacterByIdOperationContract;
    updateCharacterPictureOperationContract: UpdateCharacterPictureOperationContract;
    orgPictureUploadOperationContract: OrgPictureUploadOperationContract;
    updateCharacterOperationContract: UpdateCharacterOperationContract;

    // Service
    createCharacterServiceContract: CreateCharacterServiceContract;
    getAllCharactersServiceContract: GetAllCharactersServiceContract;
    getCharacterByIdServiceContract: GetCharacterByIdServiceContract;
    updateCharacterPictureOperationService: UpdateCharacterPictureOperationService;
    orgPictureUploadServiceContract: OrgPictureUploadServiceContract;
    updateCharacterServiceContract: UpdateCharacterServiceContract;
}
