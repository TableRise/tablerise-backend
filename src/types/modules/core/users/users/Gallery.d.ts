import GalleryService from 'src/core/users/services/users/GalleryService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GalleryOperationContract {
    galleryService: GalleryService;
    logger: Logger;
}

export interface GalleryServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
