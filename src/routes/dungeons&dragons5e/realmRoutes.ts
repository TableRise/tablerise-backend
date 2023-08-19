import { Router } from 'express';
import RealmsModel from 'src/database/models/dungeons&dragons5e/RealmsModel';
import RealmsServices from 'src/services/dungeons&dragons5e/RealmsServices';
import RealmsControllers from 'src/controllers/dungeons&dragons5e/RealmsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new RealmsModel();
const validateData = new ValidateData(logger);
const services = new RealmsServices(model, logger, validateData);
const controllers = new RealmsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
