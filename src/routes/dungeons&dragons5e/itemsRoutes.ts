import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';
import ItemsServices from 'src/services/dungeons&dragons5e/ItemsServices';
import ItemsControllers from 'src/controllers/dungeons&dragons5e/ItemsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const logger = require('@tablerise/dynamic-logger');

const validateData = new ValidateData(logger);
const DM = new DatabaseManagement();

const model = DM.modelInstance('dungeons&dragons5e', 'Items', { mock: process.env.NODE_ENV === 'test' });
const schema = DM.schemaInstance('dungeons&dragons5e');

const services = new ItemsServices(model, logger, validateData, schema);
const controllers = new ItemsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
