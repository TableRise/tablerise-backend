import { Router } from 'express';
import WeaponsModel from 'src/database/models/WeaponsModel';
import WeaponsServices from 'src/services/WeaponsServices';
import WeaponsControllers from 'src/controllers/WeaponsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const model = new WeaponsModel();
const services = new WeaponsServices(model);
const controllers = new WeaponsControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
