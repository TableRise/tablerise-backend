import { Router } from 'express';
import GodsModel from 'src/database/models/GodsModel';
import GodsServices from 'src/services/GodsServices';
import GodsControllers from 'src/controllers/GodsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new GodsModel();
const validateData = new ValidateData(logger);
const services = new GodsServices(model, logger, validateData);
const controllers = new GodsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
