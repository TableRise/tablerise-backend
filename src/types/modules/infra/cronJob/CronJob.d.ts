import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface ManagerCronJobContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
