/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import 'src/services/authentication/LocalStrategy';
import 'src/services/authentication/BearerStrategy';

import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';
import passport from 'passport';
import logger from '@tablerise/dynamic-logger';

import schema from 'src/schemas';
import UserControllers from 'src/controllers/user/UsersControllers';
import UserServices from 'src/services/user/UsersServices';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import TwoFactorMiddleware from 'src/middlewares/TwoFactorMiddleware';

const schemaValidator = new SchemaValidator();
const database = new DatabaseManagement();

export const model = database.modelInstance('user', 'Users');
const modelUserDetails = database.modelInstance('user', 'UserDetails');
const services = new UserServices(model, modelUserDetails, logger, schemaValidator, schema.user);
const controllers = new UserControllers(services, logger);
const twoFactorMiddleware = new TwoFactorMiddleware(model, logger);

const router = Router();

router.get('/:id/verify', controllers.verifyEmail);
router.post('/register', controllers.register);
router.post('/login', passport.authenticate('local', { session: false }), controllers.login);
router.patch('/:id/confirm', controllers.confirmCode);
router.delete('/:id/delete', twoFactorMiddleware.authenticate, controllers.delete);

router.use(passport.authenticate('bearer', { session: false }));
router.patch('/:id/update/email', controllers.updateEmail);

export default router;
