import UpdateUserCoverService from 'src/core/users/services/users/UpdateUserCoverService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateUserCoverOperationContract {
    updateUserCoverService: UpdateUserCoverService;
    logger: Logger;
}

export interface UpdateUserCoverServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
