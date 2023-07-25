import { Router } from 'express';
import SpellsModel from 'src/database/models/SpellsModel';
import SpellsServices from 'src/services/SpellsServices';
import SpellsControllers from 'src/controllers/SpellsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const model = new SpellsModel();
const services = new SpellsServices(model);
const controllers = new SpellsControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
