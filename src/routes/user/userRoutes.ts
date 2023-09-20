/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';

import schema from 'src/schemas';
import logger from '@tablerise/dynamic-logger';

import UserControllers from 'src/controllers/user/UsersControllers';
import UserServices from 'src/services/user/UsersServices';
import ValidateData from 'src/support/helpers/ValidateData';

const validateData = new ValidateData();
const DM = new DatabaseManagement();

const model = DM.modelInstance('user', 'Users');
const modelUserDetails = DM.modelInstance('user', 'UserDetails');

const services = new UserServices(model, modelUserDetails, logger, validateData, schema.user);
const controllers = new UserControllers(services, logger);

const router = Router();

router.post('/register', controllers.register);

export default router;
