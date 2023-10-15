/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import 'src/services/authentication/LocalStrategy';
import 'src/services/authentication/BearerStrategy';

import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';
import passport from 'passport';
import logger from '@tablerise/dynamic-logger';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';

import schema from 'src/schemas';
import UserControllers from 'src/controllers/user/UsersControllers';
import UserServices from 'src/services/user/UsersServices';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import TwoFactorMiddleware from 'src/middlewares/TwoFactorMiddleware';
import generateIDParam, { generateQueryParam } from '../parametersWrapper';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import mock from 'src/support/mocks/user';

const schemaValidator = new SchemaValidator();
const database = new DatabaseManagement();

export const model = database.modelInstance('user', 'Users');
const modelUserDetails = database.modelInstance('user', 'UserDetails');
const services = new UserServices(model, modelUserDetails, logger, schemaValidator, schema.user);
const controllers = new UserControllers(services, logger);
const twoFactorMiddleware = new TwoFactorMiddleware(model, logger);

const router = Router();

const BASE_PATH = '/profile';

export const routes = [
    {
        method: 'get',
        path: `${BASE_PATH}/:id/verify`,
        parameters: [...generateIDParam()],
        controller: controllers.verifyEmail,
        options: {
            middlewares: [VerifyIdMiddleware],
            authentication: false,
            tag: 'profile',
        },
    },
    {
        method: 'post',
        path: `${BASE_PATH}/register`,
        controller: controllers.register,
        schema: mock.user.userPayload,
        options: {
            authentication: false,
            tag: 'profile',
        },
    },
    {
        method: 'post',
        path: `${BASE_PATH}/login`,
        controller: controllers.login,
        schema: mock.user.userLogin,
        options: {
            middlewares: [passport.authenticate('local', { session: false })],
            authentication: false,
            tag: 'profile',
        },
    },
    {
        method: 'patch',
        path: `${BASE_PATH}/:id/confirm`,
        parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'code', type: 'string' }])],
        controller: controllers.confirmCode,
        options: {
            middlewares: [VerifyIdMiddleware],
            authentication: false,
            tag: 'profile',
        },
    },
    {
        method: 'patch',
        path: `${BASE_PATH}/:id/2fa/activate`,
        parameters: [...generateIDParam()],
        controller: controllers.activateTwoFactor,
        options: {
            middlewares: [VerifyIdMiddleware, passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'profile',
        },
    },
    {
        method: 'patch',
        path: `${BASE_PATH}/:id/2fa/reset`,
        parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'code', type: 'string' }])],
        controller: controllers.resetTwoFactor,
        options: {
            middlewares: [VerifyIdMiddleware, passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'profile',
        },
    },
    {
        method: 'delete',
        path: `${BASE_PATH}/:id/delete`,
        parameters: [...generateIDParam()],
        controller: controllers.delete,
        options: {
            middlewares: [
                VerifyIdMiddleware,
                passport.authenticate('bearer', { session: false }),
                twoFactorMiddleware.authenticate,
            ],
            authentication: true,
            tag: 'profile',
        },
    },
] as routeInstance[];

export default {
    routerExpress: buildRouter(routes, router),
    routesSwagger: routes,
};
