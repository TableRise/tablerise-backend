/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import 'src/services/authentication/BearerStrategy';
import passport from 'passport';
import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import logger from '@tablerise/dynamic-logger';

import schema from 'src/schemas';
import MonstersServices from 'src/services/dungeons&dragons5e/MonstersServices';
import MonstersControllers from 'src/controllers/dungeons&dragons5e/MonstersControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';
import generateIDParam, { generateQueryParam } from 'src/routes/parametersWrapper';
import mock from 'src/support/mocks/dungeons&dragons5e';
import AuthorizationMiddleware from 'src/middlewares/AuthorizationMiddleware';

const schemaValidator = new SchemaValidator();
const database = new DatabaseManagement();

const model = database.modelInstance('dungeons&dragons5e', 'Monsters');
const services = new MonstersServices(model, logger, schemaValidator, schema['dungeons&dragons5e']);
const controllers = new MonstersControllers(services, logger);

const userModel = database.modelInstance('user', 'Users');
const userModelDetails = database.modelInstance('user', 'UserDetails');

const authorizationMiddleware = new AuthorizationMiddleware(userModel, userModelDetails, logger);

const router = Router();
const BASE_PATH = '/dnd5e/monsters';

const routes = [
    {
        method: 'get',
        path: `${BASE_PATH}`,
        controller: controllers.findAll,
        options: {
            middlewares: [passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'monsters',
        },
    },
    {
        method: 'get',
        path: `${BASE_PATH}/disabled`,
        controller: controllers.findAllDisabled,
        options: {
            middlewares: [passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'monsters',
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
            tag: 'monsters',
        },
    },
    {
        method: 'put',
        path: `${BASE_PATH}/:id`,
        parameters: [...generateIDParam()],
        controller: controllers.update,
        schema: mock.monster.instance.en,
        options: {
            middlewares: [
                authorizationMiddleware.checkAdminRole,
                VerifyIdMiddleware,
                passport.authenticate('bearer', { session: false }),
            ],
            authentication: true,
            tag: 'monsters',
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
            tag: 'monsters',
        },
    },
] as routeInstance[];

export default {
    routerExpress: buildRouter(routes, router),
    routesSwagger: routes,
};
