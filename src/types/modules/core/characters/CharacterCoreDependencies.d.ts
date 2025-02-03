import {
    CreateCharacterOperationContract,
    CreateCharacterServiceContract,
} from './characters/CreateCharacter';

export default interface CharacterCoreDependencies {
    // Operations
    createCharacterOperationContract: CreateCharacterOperationContract;

    // Service
    createCharacterServiceContract: CreateCharacterServiceContract;
}
