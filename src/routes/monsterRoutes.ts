import { Router } from 'express';
import MonstersModel from 'src/database/models/MonstersModel';
import MonstersServices from 'src/services/MonstersServices';
import MonstersControllers from 'src/controllers/MonstersControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new MonstersModel(logger);
const services = new MonstersServices(model, logger);
const controllers = new MonstersControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
