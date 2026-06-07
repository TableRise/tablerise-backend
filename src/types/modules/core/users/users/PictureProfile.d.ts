import PictureProfileService from 'src/core/users/services/users/PictureProfileService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface PictureProfileOperationContract {
    pictureProfileService: PictureProfileService;
    logger: Logger;
}

export interface PictureProfileServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
