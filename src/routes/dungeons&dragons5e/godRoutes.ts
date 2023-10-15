/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';

import GodsServices from 'src/services/dungeons&dragons5e/GodsServices';
import GodsControllers from 'src/controllers/dungeons&dragons5e/GodsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';
import schema from 'src/schemas';
import passport from 'passport';
import { routeInstance, buildRouter } from '@tablerise/auto-swagger';
import mock from 'src/support/mocks/dungeons&dragons5e';
import generateIDParam, { generateQueryParam } from '../parametersWrapper';

const schemaValidator = new SchemaValidator();
const database = new DatabaseManagement();

const model = database.modelInstance('dungeons&dragons5e', 'Gods');
const services = new GodsServices(model, logger, schemaValidator, schema['dungeons&dragons5e']);
const controllers = new GodsControllers(services, logger);

const router = Router();
const BASE_PATH = '/dnd5e/gods';

const routes = [
    {
        method: 'get',
        path: `${BASE_PATH}`,
        controller: controllers.findAll,
        options: {
            middlewares: [passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'gods',
        },
    },
    {
        method: 'get',
        path: `${BASE_PATH}/disabled`,
        controller: controllers.findAllDisabled,
        options: {
            middlewares: [passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'gods',
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
            tag: 'gods',
        },
    },
    {
        method: 'put',
        path: `${BASE_PATH}/:id`,
        parameters: [...generateIDParam()],
        controller: controllers.update,
        schema: mock.god.instance.en,
        options: {
            middlewares: [VerifyIdMiddleware, passport.authenticate('bearer', { session: false })],
            authentication: true,
            tag: 'gods',
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
            ],
            authentication: true,
            tag: 'gods',
        },
    },
] as routeInstance[];

export default {
    routerExpress: buildRouter(routes, router),
    routesSwagger: routes,
};
