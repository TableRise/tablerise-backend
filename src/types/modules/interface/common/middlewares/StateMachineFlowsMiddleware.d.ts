import StateMachine from 'src/domains/common/StateMachine';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface StateMachineFlowsMiddlewareContract {
    usersRepository: UsersRepository;
    stateMachine: StateMachine;
    logger: Logger;
}
