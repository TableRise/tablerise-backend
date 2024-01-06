import PictureProfileService from 'src/core/users/services/users/PictureProfileService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface PictureProfileOperationContract {
    pictureProfileService: PictureProfileService;
    logger: Logger;
}

export interface PictureProfileServiceContract {
    usersRepository: UsersRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
