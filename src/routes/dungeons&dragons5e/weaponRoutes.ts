import { Router } from 'express';
import WeaponsModel from 'src/database/models/dungeons&dragons5e/WeaponsModel';
import WeaponsServices from 'src/services/dungeons&dragons5e/WeaponsServices';
import WeaponsControllers from 'src/controllers/dungeons&dragons5e/WeaponsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new WeaponsModel();
const services = new WeaponsServices(model, logger);
const controllers = new WeaponsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
