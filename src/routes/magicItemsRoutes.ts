import { Router } from 'express';
import MagicItemsModel from 'src/database/models/MagicItemsModel';
import MagicItemsServices from 'src/services/MagicItemsServices';
import MagicItemsControllers from 'src/controllers/MagicItemsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const model = new MagicItemsModel();
const services = new MagicItemsServices(model);
const controllers = new MagicItemsControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
