import UpdateGameInfoService from 'src/core/users/services/users/UpdateGameInfoService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/Logger';

export interface UpdateGameInfoOperationContract {
    updateGameInfoService: UpdateGameInfoService;
    logger: Logger;
}

export interface UpdateGameInfoServiceContract {
    userDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
