/* eslint-disable import/first */
import { createContainer, InjectionMode, asClass, asFunction, asValue } from 'awilix';
import logger from '@tablerise/dynamic-logger';
import DatabaseManagement from '@tablerise/database-management';
import SchemaValidator from './infra/helpers/common/SchemaValidator';
import schemas from './domains/user/schemas';
import EmailSender from './infra/helpers/user/EmailSender';
import swaggerGenerator from './infra/helpers/common/swaggerGenerator';
import UsersRoutesMiddleware from './interface/users/middlewares/UsersRoutesMiddleware';
import Serializer from './infra/helpers/user/Serializer';
import UsersRepository from './infra/repositories/user/UsersRepository';
import UsersDetailsRepository from './infra/repositories/user/UsersDetailsRepository';
import VerifyIdMiddleware from './interface/users/middlewares/VerifyIdMiddleware';
import AuthorizationMiddleware from './interface/users/middlewares/AuthorizationMiddleware';
import ErrorMiddleware from './interface/common/middlewares/ErrorMiddleware';
import Application from './core/Application';
import RoutesWrapper from './interface/users/RoutesWrapper';
import UsersRoutesBuilder from './interface/users/UsersRoutesBuilder';
import UsersRoutes from './interface/users/presentation/users/UsersRoutes';
import AuthErrorMiddleware from './interface/users/middlewares/AuthErrorMiddleware';
import OAuthRoutes from './interface/users/presentation/oauth/OAuthRoutes';
import VerifyEmailCodeMiddleware from './interface/users/middlewares/VerifyEmailCodeMiddleware';
import VerifyBooleanQueryMiddleware from './interface/common/middlewares/VerifyBooleanQueryMiddleware';

export const container = createContainer({
    injectionMode: InjectionMode.PROXY,
}) as any;

export default function setup(): void {
    container.loadModules([
        './core/**/*.js',
        './interface/users/presentation/**/*.js',
        './interface/dungeons&dragons5e/presentation/**/*.js',
    ], {
        formatName: 'camelCase',
        resolverOptions: { injectionMode: InjectionMode.PROXY },
        cwd: __dirname,
    });

    container.register({
        // #Setup
        application: asClass(Application).singleton(),
        routesWrapper: asClass(RoutesWrapper).singleton(),
        usersRoutesBuilder: asClass(UsersRoutesBuilder).singleton(),
        database: asClass(DatabaseManagement).singleton(),

        // #Helpers
        schemaValidator: asClass(SchemaValidator).singleton(),
        emailSender: asClass(EmailSender).scoped(),
        serializer: asClass(Serializer).singleton(),
        swaggerGenerator: asFunction(swaggerGenerator),

        // #Schemas
        usersSchema: asValue(schemas),

        // #Repositories
        usersRepository: asClass(UsersRepository).singleton(),
        usersDetailsRepository: asClass(UsersDetailsRepository).singleton(),

        // #Libraries
        logger: asValue(logger),

        // #Middlewares
        verifyIdMiddleware: asValue(VerifyIdMiddleware),
        authErrorMiddleware: asValue(AuthErrorMiddleware),
        verifyBooleanQueryMiddleware: asValue(VerifyBooleanQueryMiddleware),
        authorizationMiddleware: asClass(AuthorizationMiddleware).singleton(),
        verifyEmailCodeMiddleware: asClass(VerifyEmailCodeMiddleware).singleton(),
        errorMiddleware: asValue(ErrorMiddleware),

        // #Routes
        usersRoutes: asClass(UsersRoutes),
        usersRoutesMiddleware: asClass(UsersRoutesMiddleware).singleton(),
        oAuthRoutes: asClass(OAuthRoutes),
    });
}
