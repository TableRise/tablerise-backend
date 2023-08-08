import { Router } from 'express';
import WikisModel from 'src/database/models/WikisModel';
import WikisServices from 'src/services/WikisService';
import WikisControllers from 'src/controllers/WikisControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

const model = new WikisModel();
const validateData = new ValidateData(logger);
const services = new WikisServices(model, logger, validateData);
const controllers = new WikisControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
