import { Router } from 'express';
import ClassesModel from 'src/database/models/dungeons&dragons5e/ClassesModel';
import ClassesServices from 'src/services/dungeons&dragons5e/ClassesServices';
import ClassesControllers from 'src/controllers/dungeons&dragons5e/ClassesControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new ClassesModel();
const services = new ClassesServices(model, logger);
const controllers = new ClassesControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
