import GalleryService from 'src/core/users/services/users/GalleryService';
import InternalRepository from 'src/infra/repositories/internal/InternalRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GalleryOperationContract {
    galleryService: GalleryService;
    logger: Logger;
}

export interface GalleryServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    internalRepository: InternalRepository;
    logger: Logger;
}
