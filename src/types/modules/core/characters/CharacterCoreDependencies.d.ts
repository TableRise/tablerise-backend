import {
    CreateCharacterOperationContract,
    CreateCharacterServiceContract,
    GetCharacterByIdOperationContract,
    GetCharacterByIdServiceContract,
    GetAllCharactersOperationContractract,
    GetAllCharactersServiceContract,
} from './characters/CreateCharacter';

import {
    RecoverCharacterByCampaignOperationContract,
    RecoverCharacterByCampaignServiceContract,
} from './characters/RecoverCharacterByCampaign';
import {
    OrgPictureUploadOperationContract,
    OrgPictureUploadServiceContract,
} from './characters/OrganizationPicture';
import {
    UpdateCharacterOperationContract,
    UpdateCharacterServiceContract,
} from './characters/UpdateCharacter';

export default interface CharacterCoreDependencies {
    // Operations
    createCharacterOperationContract: CreateCharacterOperationContract;
    getAllCharactersOperationContract: GetAllCharactersOperationContractract;
    getCharacterByIdOperationContract: GetCharacterByIdOperationContract;
    recoverCharacterByCampaignOperationContract: RecoverCharacterByCampaignOperationContract;
    orgPictureUploadOperationContract: OrgPictureUploadOperationContract;
    updateCharacterOperationContract: UpdateCharacterOperationContract;

    // Service
    createCharacterServiceContract: CreateCharacterServiceContract;
    getAllCharactersServiceContract: GetAllCharactersServiceContract;
    getCharacterByIdServiceContract: GetCharacterByIdServiceContract;
    recoverCharacterByCampaignServiceContract: RecoverCharacterByCampaignServiceContract;
    orgPictureUploadServiceContract: OrgPictureUploadServiceContract;
    updateCharacterServiceContract: UpdateCharacterServiceContract;
}
