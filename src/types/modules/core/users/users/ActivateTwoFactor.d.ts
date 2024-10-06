import ActivateTwoFactorService from 'src/core/users/services/users/ActivateTwoFactorService';
import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
import { StateMachineProps } from 'src/domains/common/StateMachine';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface ActivateTwoFactorOperationContract {
    activateTwoFactorService: ActivateTwoFactorService;
    logger: Logger;
}

export interface ActivateTwoFactorServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    twoFactorHandler: TwoFactorHandler;
    stateMachineProps: typeof StateMachineProps;
    logger: Logger;
}
