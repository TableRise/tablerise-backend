import UpdateGameInfoService from 'src/core/users/services/users/UpdateGameInfoService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateGameInfoOperationContract {
    updateGameInfoService: UpdateGameInfoService;
    logger: Logger;
}

export interface UpdateGameInfoServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
