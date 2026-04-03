import UpdatePasswordService from 'src/core/users/services/users/UpdatePasswordService';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';
import StateMachine from 'src/domains/common/StateMachine';

export interface UpdatePasswordOperationContract {
    updatePasswordService: UpdatePasswordService;
    schemaValidator: SchemaValidator;
    logger: Logger;
}

export interface UpdatePasswordServiceContract {
    usersRepository: UsersRepository;
    stateMachine: StateMachine;
    logger: Logger;
}

export interface UserPassword {
    user: User;
    password: string;
}
