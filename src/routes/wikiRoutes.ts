import { Router } from 'express';
import WikisModel from 'src/database/models/WikisModel';
import WikisServices from 'src/services/WikisService';
import WikisControllers from 'src/controllers/WikisControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const model = new WikisModel();
const services = new WikisServices(model);
const controllers = new WikisControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
