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

export default interface CharacterCoreDependencies {
    // Operations
    createCharacterOperationContract: CreateCharacterOperationContract;
    getAllCharactersOperationContract: GetAllCharactersOperationContractract;
    recoverCharacterByCampaignOperationContract: RecoverCharacterByCampaignOperationContract;
    getCharacterByIdOperationContract: GetCharacterByIdOperationContract;

    // Service
    createCharacterServiceContract: CreateCharacterServiceContract;
    getAllCharactersServiceContract: GetAllCharactersServiceContract;
    getCharacterByIdServiceContract: GetCharacterByIdServiceContract;
    recoverCharacterByCampaignServiceContract: RecoverCharacterByCampaignServiceContract;
}
