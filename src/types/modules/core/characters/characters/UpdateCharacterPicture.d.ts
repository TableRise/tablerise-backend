import UpdateCharacterPictureService from 'src/core/characters/services/UpdateCharacterPictureService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateCharacterPictureOperationContract {
    updateCharacterPictureService: UpdateCharacterPictureService;
    logger: Logger;
}

export interface UpdateCharacterPictureOperationService {
    charactersRepository: CharactersRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
