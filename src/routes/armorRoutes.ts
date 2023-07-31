import { Router } from 'express';
import ArmorsModel from 'src/database/models/ArmorsModel';
import ArmorsServices from 'src/services/ArmorsServices';
import ArmorsControllers from 'src/controllers/ArmorsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const logger = require('@tablerise/dynamic-logger');

const model = new ArmorsModel();
const services = new ArmorsServices(model, logger);
const controllers = new ArmorsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
