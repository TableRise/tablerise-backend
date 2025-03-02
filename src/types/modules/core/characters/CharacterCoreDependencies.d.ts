import {
    CreateCharacterOperationContract,
    CreateCharacterServiceContract,
} from './characters/CreateCharacter';
import {
    RecoverCharacterByCampaignOperationContract,
    RecoverCharacterByCampaignServiceContract,
} from './characters/RecoverCharacterByCampaign';
import { 
    OrgPictureUploadOperationContract,
    OrgPictureUploadServiceContract,
} from './characters/OrganizationPicture'

export default interface CharacterCoreDependencies {
    // Operations
    createCharacterOperationContract: CreateCharacterOperationContract;
    getAllCharactersOperationContract: GetAllCharactersOperationContract;
    recoverCharacterByCampaignOperationContract: RecoverCharacterByCampaignOperationContract;
    orgPictureUploadOperationContract: OrgPictureUploadOperationContract;

    // Service
    createCharacterServiceContract: CreateCharacterServiceContract;
    getAllCharactersServiceContract: GetAllCharactersServiceContract;
    recoverCharacterByCampaignServiceContract: RecoverCharacterByCampaignServiceContract;
    orgPictureUploadServiceContract: OrgPictureUploadServiceContract;
}
