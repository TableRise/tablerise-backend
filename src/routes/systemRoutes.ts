import { Router } from 'express';
import SystemModel from '../database/models/SystemModel';
import SystemServices from '../services/SystemServices';
import SystemControllers from '../controllers/SystemControllers';

const router = Router();

const SystemModelInstance = new SystemModel();
const SystemServicesInstance = new SystemServices(SystemModelInstance);
const SystemConstrollersInstance = new SystemControllers(SystemServicesInstance);

router.post('/', SystemConstrollersInstance.create);

export default router;
