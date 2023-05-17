import { Router } from 'express';
import SystemModel from 'src/database/models/SystemModel';
import SystemServices from 'src/services/SystemServices';
import SystemControllers from 'src/controllers/SystemControllers';

const router = Router();

const SystemModelInstance = new SystemModel();
const SystemServicesInstance = new SystemServices(SystemModelInstance);
const SystemConstrollersInstance = new SystemControllers(SystemServicesInstance);

router.post('/', SystemConstrollersInstance.create);

export default router;
