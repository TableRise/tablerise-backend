import { Router } from 'express';
import RoutesWrapper from 'src/routes/RoutesWrapper';

import logger from '@tablerise/dynamic-logger';

const router = Router();

router.use('/auth', RoutesWrapper.routes().user.OAuth);

logger('info', 'Routes reading process - User - DONE');

export default router;
