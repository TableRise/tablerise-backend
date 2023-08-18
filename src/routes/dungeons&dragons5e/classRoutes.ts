import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';

import ClassesServices from 'src/services/dungeons&dragons5e/ClassesServices';
import ClassesControllers from 'src/controllers/dungeons&dragons5e/ClassesControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

const validateData = new ValidateData(logger);
const DM = new DatabaseManagement();

const model = DM.modelInstance('dungeons&dragons5e', 'Classes', { mock: process.env.NODE_ENV === 'test' });
const schema = DM.schemaInstance('dungeons&dragons5e');

const services = new ClassesServices(model, logger, validateData, schema);
const controllers = new ClassesControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
