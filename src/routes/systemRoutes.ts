import { Router } from 'express';
import SystemModel from 'src/database/models/SystemModel';
import SystemServices from 'src/services/SystemServices';
import SystemControllers from 'src/controllers/SystemControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const model = new SystemModel();
const services = new SystemServices(model);
const controllers = new SystemControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, controllers.updateContent);
router.patch('/activate/:id', VerifyIdMiddleware, controllers.activate);
router.patch('/deactivate/:id', VerifyIdMiddleware, controllers.deactivate);

export default router;
