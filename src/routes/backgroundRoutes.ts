import { Router } from 'express';
import BackgroundsModel from 'src/database/models/BackgroundsModel';
import BackgroundsServices from 'src/services/BackgroundsServices';
import BackgroundsControllers from 'src/controllers/BackgroundsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new BackgroundsModel();
const services = new BackgroundsServices(model, logger);
const controllers = new BackgroundsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
