import nodemailer from 'nodemailer';
/* eslint-disable import/first */
import { createContainer, InjectionMode, asClass, asFunction, asValue } from 'awilix';
import logger from '@tablerise/dynamic-logger';
import DatabaseManagement from '@tablerise/database-management';
import SchemaValidator from './domains/common/helpers/SchemaValidator';
import schemas from './domains/user/schemas';
import EmailSender from './domains/user/helpers/EmailSender';
import swaggerGenerator from './domains/common/helpers/swaggerGenerator';
import UsersRoutesMiddleware from './interface/users/middlewares/UsersRoutesMiddleware';
import Serializer from './domains/user/helpers/Serializer';
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
import DungeonsAndDragonsRepository from './infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import DungeonsAndDragonsRoutesBuilder from './interface/dungeons&dragons5e/DungeonsAndDragonsRoutesBuilder';
import DungeonsAndDragonsRoutesMiddleware from './interface/dungeons&dragons5e/middlewares/DungeonsAndDragonsRoutesMiddleware';
import { ContainerContract } from './types/contracts/container';
import UpdateTimestampRepository from './infra/repositories/user/UpdateTimestampRepository';
import configs from './infra/configs';
import TwoFactorHandler from './domains/common/helpers/TwoFactorHandler';

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
        configs: asValue(configs),

        // #Helpers
        schemaValidator: asClass(SchemaValidator).singleton(),
        emailSender: asClass(EmailSender).singleton(),
        serializer: asClass(Serializer).singleton(),
        swaggerGenerator: asFunction(swaggerGenerator),
        twoFactorHandler: asClass(TwoFactorHandler).singleton(),

        // #Schemas
        usersSchema: asValue(schemas),

        // #Repositories
        dungeonsAndDragonsRepository: asClass(DungeonsAndDragonsRepository).singleton(),
        usersRepository: asClass(UsersRepository).singleton(),
        usersDetailsRepository: asClass(UsersDetailsRepository).singleton(),
        updateTimestampRepository: asClass(UpdateTimestampRepository).singleton(),

        // #Libraries
        logger: asValue(logger),
        nodemailer: asValue(nodemailer),

        // #Values
        emailType: asValue('common'),

        // #Middlewares
        verifyIdMiddleware: asValue(VerifyIdMiddleware),
        authErrorMiddleware: asValue(AuthErrorMiddleware),
        authorizationMiddleware: asClass(AuthorizationMiddleware).singleton(),
        verifyEmailCodeMiddleware: asClass(VerifyEmailCodeMiddleware).singleton(),
        errorMiddleware: asValue(ErrorMiddleware),
        usersRoutesMiddleware: asClass(UsersRoutesMiddleware).singleton(),
        dungeonsAndDragonsRoutesMiddleware: asClass(
            DungeonsAndDragonsRoutesMiddleware
        ).singleton(),
    });
}
