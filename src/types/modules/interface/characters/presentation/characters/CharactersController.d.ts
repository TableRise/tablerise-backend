import CreateCharacterOperation from 'src/core/characters/operations/CreateCharacterOperation';
import GetAllCharactersOperation from 'src/core/characters/operations/GetAllCharactersOperation';

export interface CharactersControllerContract {
    createCharacterOperation: CreateCharacterOperation;
    getAllCharactersOperation: GetAllCharactersOperation;
}
