import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { IUsersSchemas } from '../presentation/users/UsersSchemas';

export interface LoginPassportContract {
    schemaValidator: SchemaValidator;
    usersRepository: UsersRepository;
    usersSchemas: IUsersSchemas;
}
