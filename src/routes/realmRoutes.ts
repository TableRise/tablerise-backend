import { Router } from 'express';
import RealmsModel from 'src/database/models/RealmsModel';
import RealmsServices from 'src/services/RealmsServices';
import RealmsControllers from 'src/controllers/RealmsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

const model = new RealmsModel();
const validateData = new ValidateData(logger);
const services = new RealmsServices(model, logger, validateData);
const controllers = new RealmsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
