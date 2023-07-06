import { Router } from 'express';
import GodsModel from 'src/database/models/GodsModel';
import GodsServices from 'src/services/GodsServices';
import GodsControllers from 'src/controllers/GodsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const model = new GodsModel();
const services = new GodsServices(model);
const controllers = new GodsControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
