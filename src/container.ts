import { createContainer, InjectionMode, asClass, asFunction, asValue } from 'awilix';
import logger from '@tablerise/dynamic-logger';
import DatabaseManagement from '@tablerise/database-management';
import SchemaValidator from './infra/helpers/common/SchemaValidator';
import schemas from './domains/user/schemas';
import HttpRequestErrors from './infra/helpers/common/HttpRequestErrors';
import EmailSender from './infra/helpers/user/EmailSender';
import swaggerGenerator from './infra/helpers/common/swaggerGenerator';
import UsersRoutesMiddleware from './interface/users/middlewares/UsersRoutesMiddleware';
import { SecurePasswordHandler } from './infra/helpers/user/SecurePasswordHandler';
import Serializer from './infra/helpers/user/Serializer';
import UsersRepository from './infra/repositories/user/UsersRepository';
import UsersDetailsRepository from './infra/repositories/user/UsersDetailsRepository';
import VerifyIdMiddleware from './interface/users/middlewares/VerifyIdMiddleware';
import AuthorizationMiddleware from './interface/users/middlewares/AuthorizationMiddleware';
import ErrorMiddleware from './interface/common/middlewares/ErrorMiddleware';

export const container = createContainer({
    injectionMode: InjectionMode.PROXY
}) as any;

export default function setup(): void {
    container.loadModules([
        './core/**/*.ts'
    ], { formatName: 'camelCase', resolverOptions: { injectionMode: InjectionMode.PROXY }, cwd: __dirname });

    container.register({
        // #Helpers
        schemaValidator: asClass(SchemaValidator),
        emailSender: asClass(EmailSender),
        httpRequestErrors: asClass(HttpRequestErrors),
        securePasswordHandler: asClass(SecurePasswordHandler),
        usersRoutesMiddleware: asClass(UsersRoutesMiddleware),
        serializer: asClass(Serializer),
        swaggerGenerator: asFunction(swaggerGenerator),

        // #Data
        database: asClass(DatabaseManagement),
        usersSchema: asValue(schemas),
        
        // #Repositories
        usersRepository: asClass(UsersRepository),
        usersDetialsRepository: asClass(UsersDetailsRepository),

        // #Libraries
        logger: asFunction(logger),

        // #Middlewares
        verifyIdMiddleware: asFunction(VerifyIdMiddleware),
        authorizationMiddleware: asClass(AuthorizationMiddleware),
        errorMiddleware: asFunction(ErrorMiddleware)
    });
};
