import { Router } from 'express';
import MagicItemsModel from 'src/database/models/MagicItemsModel';
import MagicItemsServices from 'src/services/MagicItemsServices';
import MagicItemsControllers from 'src/controllers/MagicItemsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

const validateData = new ValidateData(logger);
const model = new MagicItemsModel();
const services = new MagicItemsServices(model, logger, validateData);
const controllers = new MagicItemsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.delete('/:id', VerifyIdMiddleware, controllers.delete);

export default router;
