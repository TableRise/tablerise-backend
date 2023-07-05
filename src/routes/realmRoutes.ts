import { Router } from 'express';
import RealmsModel from 'src/database/models/RealmsModel';
import RealmsServices from 'src/services/RealmsServices';
import RealmsControllers from 'src/controllers/RealmsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const model = new RealmsModel();
const services = new RealmsServices(model);
const controllers = new RealmsControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
