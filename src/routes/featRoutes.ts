import { Router } from 'express';
import FeatsModel from 'src/database/models/FeatsModel';
import FeatsServices from 'src/services/FeatsServices';
import FeatsControllers from 'src/controllers/FeatsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

const model = new FeatsModel();
const validateData = new ValidateData(logger);
const services = new FeatsServices(model, logger, validateData);
const controllers = new FeatsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
