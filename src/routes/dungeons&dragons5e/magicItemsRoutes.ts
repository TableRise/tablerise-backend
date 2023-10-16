/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';

import MagicItemsServices from 'src/services/dungeons&dragons5e/MagicItemsServices';
import MagicItemsControllers from 'src/controllers/dungeons&dragons5e/MagicItemsControllers';
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

const model = database.modelInstance('dungeons&dragons5e', 'MagicItems');
const services = new MagicItemsServices(model, logger, schemaValidator, schema['dungeons&dragons5e']);
const controllers = new MagicItemsControllers(services, logger);

const userModel = database.modelInstance('user', 'Users');
const userModelDetails = database.modelInstance('user', 'UserDetails');

const authorizationMiddleware = new AuthorizationMiddleware(userModel, userModelDetails, logger);

const router = Router();
const BASE_PATH = '/dnd5e/magicItems';

const routes = [
    {
        method: 'get',
        path: `${BASE_PATH}`,
        controller: controllers.findAll,
        options: {
            middlewares: [passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'magicItems',
        },
    },
    {
        method: 'get',
        path: `${BASE_PATH}/disabled`,
        controller: controllers.findAllDisabled,
        options: {
            middlewares: [passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'magicItems',
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
            tag: 'magicItems',
        },
    },
    {
        method: 'put',
        path: `${BASE_PATH}/:id`,
        parameters: [...generateIDParam()],
        controller: controllers.update,
        schema: mock.magicItems.instance.en,
        options: {
            middlewares: [
                authorizationMiddleware.checkAdminRole,
                VerifyIdMiddleware,
                passport.authenticate('bearer', { session: false }),
            ],
            authentication: true,
            tag: 'magicItems',
        },
    },
    {
        method: 'patch',
        path: `${BASE_PATH}/:id`,
        parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        controller: controllers.updateAvailability,
        options: {
            middlewares: [
                authorizationMiddleware.checkAdminRole,
                VerifyIdMiddleware,
                VerifyBooleanQueryMiddleware,
                passport.authenticate('bearer', { session: false }),
            ],
            authentication: true,
            tag: 'magicItems',
        },
    },
] as routeInstance[];

export default {
    routerExpress: buildRouter(routes, router),
    routesSwagger: routes,
};
