import { Router } from 'express';
import BackgroundsModel from 'src/database/models/dungeons&dragons5e/BackgroundsModel';
import BackgroundsServices from 'src/services/dungeons&dragons5e/BackgroundsServices';
import BackgroundsControllers from 'src/controllers/dungeons&dragons5e/BackgroundsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new BackgroundsModel();
const services = new BackgroundsServices(model, logger);
const controllers = new BackgroundsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
