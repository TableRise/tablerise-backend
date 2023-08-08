import { Router } from 'express';
import ClassesModel from 'src/database/models/ClassesModel';
import ClassesServices from 'src/services/ClassesServices';
import ClassesControllers from 'src/controllers/ClassesControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

const model = new ClassesModel();
const validateData = new ValidateData(logger);
const services = new ClassesServices(model, logger, validateData);
const controllers = new ClassesControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
