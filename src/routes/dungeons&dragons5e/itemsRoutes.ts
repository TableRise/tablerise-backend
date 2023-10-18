/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';

import ItemsServices from 'src/services/dungeons&dragons5e/ItemsServices';
import ItemsControllers from 'src/controllers/dungeons&dragons5e/ItemsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';
import schema from 'src/schemas';
import { routeInstance, buildRouter } from '@tablerise/auto-swagger';
import mock from 'src/support/mocks/dungeons&dragons5e';
import passport from 'passport';
import generateIDParam, { generateQueryParam } from '../parametersWrapper';
import AuthorizationMiddleware from 'src/middlewares/AuthorizationMiddleware';

const schemaValidator = new SchemaValidator();
const database = new DatabaseManagement();

const model = database.modelInstance('dungeons&dragons5e', 'Items');
const services = new ItemsServices(model, logger, schemaValidator, schema['dungeons&dragons5e']);
const controllers = new ItemsControllers(services, logger);

const userModelDetails = database.modelInstance('user', 'UserDetails');

const authorizationMiddleware = new AuthorizationMiddleware(undefined, userModelDetails, logger);

const router = Router();
const BASE_PATH = '/dnd5e/items';

const routes = [
    {
        method: 'get',
        path: `${BASE_PATH}`,
        controller: controllers.findAll,
        options: {
            middlewares: [passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'items',
        },
    },
    {
        method: 'get',
        path: `${BASE_PATH}/disabled`,
        controller: controllers.findAllDisabled,
        options: {
            middlewares: [passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'items',
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
            tag: 'items',
        },
    },
    {
        method: 'put',
        path: `${BASE_PATH}/:id`,
        parameters: [...generateIDParam()],
        controller: controllers.update,
        schema: mock.item.instance.en,
        options: {
            middlewares: [
                VerifyIdMiddleware,
                passport.authenticate('bearer', { session: false }),
                authorizationMiddleware.checkAdminRole,
            ],
            authentication: true,
            tag: 'items',
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
            tag: 'items',
        },
    },
] as routeInstance[];

export default {
    routerExpress: buildRouter(routes, router),
    routesSwagger: routes,
};
