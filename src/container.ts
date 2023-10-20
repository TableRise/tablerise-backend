import { createContainer, InjectionMode, asClass, asFunction, asValue } from 'awilix';
import logger from '@tablerise/dynamic-logger';
import DatabaseManagement from '@tablerise/database-management';
import SchemaValidator from './infra/helpers/SchemaValidator';
import schemas from './schemas';
import HttpRequestErrors from './infra/helpers/HttpRequestErrors';
import EmailSender from './services/user/helpers/EmailSender';
import { HttpStatusCode } from './infra/helpers/HttpStatusCode';
import swaggerGenerator from './support/helpers/swaggerGenerator';
import UsersRoutesMiddleware from './interface/users/middlewares/UsersRoutesMiddleware';

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
        usersSchema: asValue(schemas.user),
        dnd5eSchema: asValue(schemas['dungeons&dragons5e']),
        logger: asFunction(logger),
        httpRequestErrors: asClass(HttpRequestErrors),
        httpStatusCode: asValue(HttpStatusCode),
        usersRoutesMiddleware: asClass(UsersRoutesMiddleware)
    });
};
