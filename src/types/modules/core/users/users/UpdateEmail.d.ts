import UpdateEmailService from 'src/core/users/services/users/UpdateEmailService';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';
import StateMachine from 'src/domains/common/StateMachine';

export interface UpdateEmailOperationContract {
    updateEmailService: UpdateEmailService;
    logger: Logger;
}

export interface UpdateEmailServiceContract {
    usersRepository: UsersRepository;
    stateMachine: StateMachine;
    logger: Logger;
}

export interface UserEmail {
    user: User;
    email: string;
}
