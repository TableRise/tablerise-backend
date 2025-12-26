import UpdateEmailService from 'src/core/users/services/users/UpdateEmailService';
import { SchemasUserType } from 'src/domains/users/schemas';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';
import StateMachine from 'src/domains/common/StateMachine';

export interface UpdateEmailOperationContract {
    updateEmailService: UpdateEmailService;
    schemaValidator: SchemaValidator;
    usersSchema: SchemasUserType;
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
