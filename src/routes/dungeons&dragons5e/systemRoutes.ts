/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';

import schema from 'src/schemas';
import SystemServices from 'src/services/dungeons&dragons5e/SystemServices';
import SystemControllers from 'src/controllers/dungeons&dragons5e/SystemControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const validateData = new ValidateData();
const DM = new DatabaseManagement();

const model = DM.modelInstance('dungeons&dragons5e', 'System');

const services = new SystemServices(model, logger, validateData, schema['dungeons&dragons5e']);
const controllers = new SystemControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/content/:id', VerifyIdMiddleware, controllers.updateContent);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
