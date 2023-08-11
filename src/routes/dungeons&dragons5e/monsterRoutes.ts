import { Router } from 'express';
import MonstersModel from 'src/database/models/dungeons&dragons5e/MonstersModel';
import MonstersServices from 'src/services/dungeons&dragons5e/MonstersServices';
import MonstersControllers from 'src/controllers/dungeons&dragons5e/MonstersControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new MonstersModel();
const services = new MonstersServices(model, logger);
const controllers = new MonstersControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
