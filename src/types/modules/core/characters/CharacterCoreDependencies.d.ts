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
<<<<<<< HEAD
    UpdateCharacterPictureOperationContract,
    UpdateCharacterPictureOperationService,
} from './characters/UpdateCharacterPicture';
=======
    OrgPictureUploadOperationContract,
    OrgPictureUploadServiceContract,
} from './characters/OrganizationPicture';
import {
    UpdateCharacterOperationContract,
    UpdateCharacterServiceContract,
} from './characters/UpdateCharacter';
>>>>>>> 7a27a065299cf4219a8e57c369c140f551811a41

export default interface CharacterCoreDependencies {
    // Operations
    createCharacterOperationContract: CreateCharacterOperationContract;
    getAllCharactersOperationContract: GetAllCharactersOperationContractract;
    getCharacterByIdOperationContract: GetCharacterByIdOperationContract;
    recoverCharacterByCampaignOperationContract: RecoverCharacterByCampaignOperationContract;
<<<<<<< HEAD
    updateCharacterPictureOperationContract: UpdateCharacterPictureOperationContract;
=======
    orgPictureUploadOperationContract: OrgPictureUploadOperationContract;
    updateCharacterOperationContract: UpdateCharacterOperationContract;
>>>>>>> 7a27a065299cf4219a8e57c369c140f551811a41

    // Service
    createCharacterServiceContract: CreateCharacterServiceContract;
    getAllCharactersServiceContract: GetAllCharactersServiceContract;
    getCharacterByIdServiceContract: GetCharacterByIdServiceContract;
    recoverCharacterByCampaignServiceContract: RecoverCharacterByCampaignServiceContract;
<<<<<<< HEAD
    updateCharacterPictureOperationService: UpdateCharacterPictureOperationService;
=======
    orgPictureUploadServiceContract: OrgPictureUploadServiceContract;
    updateCharacterServiceContract: UpdateCharacterServiceContract;
>>>>>>> 7a27a065299cf4219a8e57c369c140f551811a41
}
