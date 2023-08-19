import { Router } from 'express';
import BackgroundsModel from 'src/database/models/BackgroundsModel';
import BackgroundsServices from 'src/services/BackgroundsServices';
import BackgroundsControllers from 'src/controllers/BackgroundsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new BackgroundsModel();
const validateData = new ValidateData(logger);
const services = new BackgroundsServices(model, logger, validateData);
const controllers = new BackgroundsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
