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
import RoutesWrapper from './interface/common/RoutesWrapper';
import UsersRoutesBuilder from './interface/users/UsersRoutesBuilder';
import AuthErrorMiddleware from './interface/users/middlewares/AuthErrorMiddleware';
import VerifyEmailCodeMiddleware from './interface/users/middlewares/VerifyEmailCodeMiddleware';
import VerifyBooleanQueryMiddleware from './interface/common/middlewares/VerifyBooleanQueryMiddleware';
import DungeonsAndDragonsRepository from './infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import DungeonsAndDragonsRoutesBuilder from './interface/dungeons&dragons5e/DungeonsAndDragonsRoutesBuilder';
import DungeonsAndDragonsRoutesMiddleware from './interface/dungeons&dragons5e/middlewares/UsersRoutesMiddleware';
import { ContainerContract } from './types/contracts/container';

export const container = createContainer({
    injectionMode: InjectionMode.PROXY,
}) as any;

export default function setup({ loadExt }: ContainerContract = { loadExt: 'js' }): void {
    container.loadModules(
        [
            `./core/**/*.${loadExt}`,
            `./interface/users/presentation/**/*.${loadExt}`,
            `./interface/dungeons&dragons5e/presentation/**/*.${loadExt}`,
        ],
        {
            formatName: 'camelCase',
            resolverOptions: { injectionMode: InjectionMode.PROXY },
            cwd: __dirname,
        }
    );

    container.register({
        // #Setup
        application: asClass(Application).singleton(),
        routesWrapper: asClass(RoutesWrapper).singleton(),
        usersRoutesBuilder: asClass(UsersRoutesBuilder).singleton(),
        dungeonsAndDragonsRoutesBuilder: asClass(
            DungeonsAndDragonsRoutesBuilder
        ).singleton(),
        database: asClass(DatabaseManagement).singleton(),

        // #Helpers
        schemaValidator: asClass(SchemaValidator).singleton(),
        emailSender: asClass(EmailSender).scoped(),
        serializer: asClass(Serializer).singleton(),
        swaggerGenerator: asFunction(swaggerGenerator),

        // #Schemas
        usersSchema: asValue(schemas),

        // #Repositories
        dungeonsAndDragonsRepository: asClass(DungeonsAndDragonsRepository).singleton(),
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
        usersRoutesMiddleware: asClass(UsersRoutesMiddleware).singleton(),
        dungeonsAndDragonsRoutesMiddleware: asClass(
            DungeonsAndDragonsRoutesMiddleware
        ).singleton(),
    });
}
