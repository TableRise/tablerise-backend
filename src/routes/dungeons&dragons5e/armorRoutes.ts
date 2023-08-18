import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';

import ArmorsServices from 'src/services/dungeons&dragons5e/ArmorsServices';
import ArmorsControllers from 'src/controllers/dungeons&dragons5e/ArmorsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

const validateData = new ValidateData(logger);
const DM = new DatabaseManagement();

const model = DM.modelInstance('dungeons&dragons5e', 'Armors', { mock: process.env.NODE_ENV === 'test' });
const schema = DM.schemaInstance('dungeons&dragons5e');

const services = new ArmorsServices(model, logger, validateData, schema);
const controllers = new ArmorsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
