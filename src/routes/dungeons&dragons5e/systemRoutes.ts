import { Router } from 'express';
import SystemModel from 'src/database/models/dungeons&dragons5e/SystemModel';
import SystemServices from 'src/services/dungeons&dragons5e/SystemServices';
import SystemControllers from 'src/controllers/dungeons&dragons5e/SystemControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

const model = new SystemModel();
const validateData = new ValidateData(logger);
const services = new SystemServices(model, logger, validateData);
const controllers = new SystemControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, controllers.updateContent);
router.patch('/activate/:id', VerifyIdMiddleware, controllers.activate);
router.patch('/deactivate/:id', VerifyIdMiddleware, controllers.deactivate);

export default router;
