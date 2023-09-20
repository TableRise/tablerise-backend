/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Router } from 'express';
import DatabaseManagement from '@tablerise/database-management';

import schema from 'src/schemas';
import SpellsServices from 'src/services/dungeons&dragons5e/SpellsServices';
import SpellsControllers from 'src/controllers/dungeons&dragons5e/SpellsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';

const validateData = new ValidateData();
const DM = new DatabaseManagement();

const model = DM.modelInstance('dungeons&dragons5e', 'Spells');

const services = new SpellsServices(model, logger, validateData, schema['dungeons&dragons5e']);
const controllers = new SpellsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
