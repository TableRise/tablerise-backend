import { Router } from 'express';
import RacesModel from 'src/database/models/RacesModel';
import RacesServices from 'src/services/RacesServices';
import RacesControllers from 'src/controllers/RacesControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new RacesModel(logger);
const services = new RacesServices(model, logger);
const controllers = new RacesControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
