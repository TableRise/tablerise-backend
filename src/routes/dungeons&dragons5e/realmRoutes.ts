/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';

import schema from 'src/schemas';
import RealmsServices from 'src/services/dungeons&dragons5e/RealmsServices';
import RealmsControllers from 'src/controllers/dungeons&dragons5e/RealmsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/services/helpers/ValidateData';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

import logger from '@tablerise/dynamic-logger';

const validateData = new ValidateData();
const DM = new DatabaseManagement();

const model = DM.modelInstance('dungeons&dragons5e', 'Realms');

const services = new RealmsServices(model, logger, validateData, schema['dungeons&dragons5e']);
const controllers = new RealmsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
