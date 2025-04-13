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
    UpdateCharacterPictureOperationContract,
    UpdateCharacterPictureOperationService,
} from './characters/UpdateCharacterPicture';
import {
    OrgPictureUploadOperationContract,
    OrgPictureUploadServiceContract,
} from './characters/OrganizationPicture';

export default interface CharacterCoreDependencies {
    // Operations
    createCharacterOperationContract: CreateCharacterOperationContract;
    getAllCharactersOperationContract: GetAllCharactersOperationContractract;
    getCharacterByIdOperationContract: GetCharacterByIdOperationContract;
    recoverCharacterByCampaignOperationContract: RecoverCharacterByCampaignOperationContract;
    updateCharacterPictureOperationContract: UpdateCharacterPictureOperationContract;
    orgPictureUploadOperationContract: OrgPictureUploadOperationContract;

    // Service
    createCharacterServiceContract: CreateCharacterServiceContract;
    getAllCharactersServiceContract: GetAllCharactersServiceContract;
    getCharacterByIdServiceContract: GetCharacterByIdServiceContract;
    recoverCharacterByCampaignServiceContract: RecoverCharacterByCampaignServiceContract;
    updateCharacterPictureOperationService: UpdateCharacterPictureOperationService;
    orgPictureUploadServiceContract: OrgPictureUploadServiceContract;
}
