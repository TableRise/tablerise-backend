import StateMachine from 'src/domains/common/StateMachine';
import DeactivateTwoFactorService from 'src/core/users/services/users/DeactivateTwoFactorService';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface DeactivateTwoFactorOperationContract {
    deactivateTwoFactorService: DeactivateTwoFactorService;
    logger: Logger;
}

export interface DeactivateTwoFactorServiceContract {
    usersRepository: UsersRepository;
    stateMachine: StateMachine;
    logger: Logger;
}
