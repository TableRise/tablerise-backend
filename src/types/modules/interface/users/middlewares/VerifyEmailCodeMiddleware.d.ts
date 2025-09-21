import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import StateMachine from 'src/domains/common/StateMachine';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';
import { IUsersSchemas } from '../presentation/users/UsersSchemas';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';

export interface VerifyEmailCodeMiddlewareContract {
    usersRepository: UsersRepository;
    usersSchemas: IUsersSchemas;
    usersDetailsRepository: UsersDetailsRepository;
    stateMachine: StateMachine;
    schemaValidator: SchemaValidator;
    logger: Logger;
}
