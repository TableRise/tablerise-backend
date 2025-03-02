import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import { Logger } from 'src/types/shared/logger';

export interface OrgPictureUploadOperationContract {
    orgPictureUploadService: OrgPictureUploadService;
    logger: Logger;
}

export interface OrgPictureUploadServiceContract {
    logger: Logger;
    charactersRepository: CharactersRepository;
    imageStorageClient: ImageStorageClient;
}
