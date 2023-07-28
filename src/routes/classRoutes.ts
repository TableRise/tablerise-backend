import { Router } from 'express';
import ClassesModel from 'src/database/models/ClassesModel';
import ClassesServices from 'src/services/ClassesServices';
import ClassesControllers from 'src/controllers/ClassesControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const model = new ClassesModel();
const services = new ClassesServices(model);
const controllers = new ClassesControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
