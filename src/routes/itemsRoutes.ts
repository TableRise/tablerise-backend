import { Router } from 'express';
import ItemsModel from 'src/database/models/ItemsModel';
import ItemsServices from 'src/services/ItemsServices';
import ItemsControllers from 'src/controllers/ItemsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const model = new ItemsModel();
const services = new ItemsServices(model);
const controllers = new ItemsControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
