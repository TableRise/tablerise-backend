import { createContainer, InjectionMode, asClass, asFunction, asValue } from 'awilix';
import logger from '@tablerise/dynamic-logger';
import DatabaseManagement from '@tablerise/database-management';
import SchemaValidator from './infra/helpers/common/SchemaValidator';
import schemas from './domains/user/schemas';
import HttpRequestErrors from './infra/helpers/common/HttpRequestErrors';
import EmailSender from './infra/helpers/user/EmailSender';
import { HttpStatusCode } from './infra/helpers/common/HttpStatusCode';
import swaggerGenerator from './infra/helpers/common/swaggerGenerator';
import UsersRoutesMiddleware from './interface/users/middlewares/UsersRoutesMiddleware';
import { SecurePasswordHandler } from './infra/helpers/user/SecurePasswordHandler';
import Serializer from './infra/helpers/user/Serializer';

const Database = new DatabaseManagement();

export const container = createContainer({
    injectionMode: InjectionMode.PROXY
}) as any;

export default function setup(): void {
    container.loadModules([
        './core/**/*.ts',
        './authentication/**/*.ts',
        './interface/**/*.ts'
    ], { formatName: 'camelCase', resolverOptions: { injectionMode: InjectionMode.PROXY }, cwd: __dirname });

    container.register({
        schemaValidator: asClass(SchemaValidator),
        emailSender: asClass(EmailSender),
        httpRequestErrors: asClass(HttpRequestErrors),
        usersRoutesMiddleware: asClass(UsersRoutesMiddleware),
        securePasswordHandler: asClass(SecurePasswordHandler),
        serializer: asClass(Serializer),
        swaggerGenerator: asFunction(swaggerGenerator),
        logger: asFunction(logger),
        usersModel: asValue(Database.modelInstance('user', 'Users')),
        usersDetailsModel: asValue(Database.modelInstance('user', 'UserDetails')),
        usersSchema: asValue(schemas),
        httpStatusCode: asValue(HttpStatusCode)
    });
};
