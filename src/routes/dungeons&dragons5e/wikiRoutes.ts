import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';
import WikisServices from 'src/services/dungeons&dragons5e/WikisService';
import WikisControllers from 'src/controllers/dungeons&dragons5e/WikisControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const logger = require('@tablerise/dynamic-logger');

const validateData = new ValidateData(logger);
const DM = new DatabaseManagement();

const model = DM.modelInstance('dungeons&dragons5e', 'Wikis');
const schema = DM.schemaInstance('dungeons&dragons5e');

const services = new WikisServices(model, logger, validateData, schema);
const controllers = new WikisControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
