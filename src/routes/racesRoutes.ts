import { Router } from 'express';
import RacesModel from 'src/database/models/RacesModel';
import RacesServices from 'src/services/RacesServices';
import RacesControllers from 'src/controllers/RacesControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new RacesModel();
const services = new RacesServices(model, logger);
const controllers = new RacesControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
