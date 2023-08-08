import { Router } from 'express';
import WeaponsModel from 'src/database/models/WeaponsModel';
import WeaponsServices from 'src/services/WeaponsServices';
import WeaponsControllers from 'src/controllers/WeaponsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

const model = new WeaponsModel();
const validateData = new ValidateData(logger);
const services = new WeaponsServices(model, logger, validateData);
const controllers = new WeaponsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
