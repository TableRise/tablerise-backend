import { Router } from 'express';
import FeatsModel from 'src/database/models/FeatsModel';
import FeatsServices from 'src/services/FeatsServices';
import FeatsControllers from 'src/controllers/FeatsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const model = new FeatsModel();
const services = new FeatsServices(model);
const controllers = new FeatsControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
