import { CronJob } from 'cron';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface ManagerCronJobContract {
    jobs: CronJob[];
    logger: Logger;
}

export interface DeleteUserCronJobContract {
    logger: Logger;
    usersRepository: UsersRepository;
}

export interface UserDeleteListCronJobContract {
    logger: Logger;
    usersRepository: UsersRepository;
    usersDeleteList: UserInstance[];
}