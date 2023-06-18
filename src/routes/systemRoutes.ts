import { Router } from 'express';
import SystemsModel from 'src/database/models/SystemsModel';
import SystemsServices from 'src/services/SystemsServices';
import SystemsControllers from 'src/controllers/SystemsControllers';

const model = new SystemsModel();
const services = new SystemsServices(model);
const controllers = new SystemsControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', controllers.findOne);

export default router;
