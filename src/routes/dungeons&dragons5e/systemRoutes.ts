/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import 'src/services/authentication/BearerStrategy';
import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';

import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';
import SystemServices from 'src/services/dungeons&dragons5e/SystemServices';
import SystemControllers from 'src/controllers/dungeons&dragons5e/SystemControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import schema from 'src/schemas';
import { routeInstance, buildRouter } from '@tablerise/auto-swagger';
import mock from 'src/support/mocks/dungeons&dragons5e';
import passport from 'passport';
import generateIDParam, { generateQueryParam } from '../parametersWrapper';
import AuthorizationMiddleware from 'src/middlewares/AuthorizationMiddleware';

const schemaValidator = new SchemaValidator();
const database = new DatabaseManagement();

const model = database.modelInstance('dungeons&dragons5e', 'System');
const services = new SystemServices(model, logger, schemaValidator, schema['dungeons&dragons5e']);
const controllers = new SystemControllers(services, logger);

const userModelDetails = database.modelInstance('user', 'UserDetails');

const authorizationMiddleware = new AuthorizationMiddleware(undefined, userModelDetails, logger);

const router = Router();
const BASE_PATH = '/dnd5e/system';

const routes = [
    {
        method: 'get',
        path: `${BASE_PATH}`,
        controller: controllers.findAll,
        options: {
            middlewares: [passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'system',
        },
    },
    {
        method: 'get',
        path: `${BASE_PATH}/:id`,
        parameters: [...generateIDParam()],
        controller: controllers.findOne,
        options: {
            middlewares: [VerifyIdMiddleware, passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'system',
        },
    },
    {
        method: 'put',
        path: `${BASE_PATH}/:id`,
        parameters: [...generateIDParam()],
        controller: controllers.update,
        schema: mock.system.instance.en,
        options: {
            middlewares: [
                VerifyIdMiddleware,
                passport.authenticate('bearer', { session: false }),
                authorizationMiddleware.checkAdminRole,
            ],
            authentication: true,
            tag: 'system',
        },
    },

    {
        method: 'patch',
        path: `${BASE_PATH}/content/:id`,
        parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'entity', type: 'string' }])],
        controller: controllers.updateContent,
        schema: mock.updateSystemContent.instance,
        options: {
            middlewares: [
                VerifyIdMiddleware,
                passport.authenticate('bearer', { session: false }),
                authorizationMiddleware.checkAdminRole,
            ],
            authentication: true,
            tag: 'system',
        },
    },
    {
        method: 'patch',
        path: `${BASE_PATH}/:id`,
        parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        controller: controllers.updateAvailability,
        options: {
            middlewares: [
                VerifyIdMiddleware,
                VerifyBooleanQueryMiddleware,
                passport.authenticate('bearer', { session: false }),
                authorizationMiddleware.checkAdminRole,
            ],
            authentication: true,
            tag: 'system',
        },
    },
] as routeInstance[];

export default {
    routerExpress: buildRouter(routes, router),
    routesSwagger: routes,
};
