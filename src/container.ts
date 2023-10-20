import { createContainer, InjectionMode, asClass, asFunction, asValue } from 'awilix';
import logger from '@tablerise/dynamic-logger';
import DatabaseManagement from '@tablerise/database-management';
import SchemaValidator from './infra/helpers/SchemaValidator';
import schemas from './domains/user/schemas';
import HttpRequestErrors from './infra/helpers/HttpRequestErrors';
import EmailSender from './infra/helpers/EmailSender';
import { HttpStatusCode } from './infra/helpers/HttpStatusCode';
import swaggerGenerator from './infra/helpers/swaggerGenerator';
import UsersRoutesMiddleware from './interface/users/middlewares/UsersRoutesMiddleware';
import { SecurePasswordHandler } from './infra/helpers/SecurePasswordHandler';

const Database = new DatabaseManagement();

export const container = createContainer({
    injectionMode: InjectionMode.PROXY
}) as any;

export default function setup(): void {
    container.loadModules([
        'src/core/**/*.ts',
        'src/authentication/**/*.ts',
        'src/interface/**/*.ts'
    ], { resolverOptions: { injectionMode: InjectionMode.PROXY } });

    container.register({
        schemaValidator: asClass(SchemaValidator),
        emailSender: asClass(EmailSender),
        swaggerGenerator: asFunction(swaggerGenerator),
        usersModel: asValue(Database.modelInstance('user', 'Users')),
        usersDetailsModel: asValue(Database.modelInstance('user', 'UserDetails')),
        usersSchema: asValue(schemas),
        logger: asFunction(logger),
        httpRequestErrors: asClass(HttpRequestErrors),
        httpStatusCode: asValue(HttpStatusCode),
        usersRoutesMiddleware: asClass(UsersRoutesMiddleware),
        securePasswordHandler: asClass(SecurePasswordHandler)
    });
};
