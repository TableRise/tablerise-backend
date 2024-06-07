import DeleteUserCronJob from 'src/infra/cronJob/DeleteUserCronJob';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface ManagerCronJobContract {
    deleteUserCronJob: DeleteUserCronJob;
    usersRepository: UsersRepository;
    logger: Logger;
}

export interface DeleteUserCronJobContract {
    logger: Logger;
    usersRepository: UsersRepository;
}


