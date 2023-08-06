import { Router } from 'express';
import FeatsModel from 'src/database/models/FeatsModel';
import FeatsServices from 'src/services/FeatsServices';
import FeatsControllers from 'src/controllers/FeatsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new FeatsModel();
const services = new FeatsServices(model, logger);
const controllers = new FeatsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
