import { Router } from 'express';
import RoutesWrapper from 'src/routes/RoutesWrapper';

import logger from '@tablerise/dynamic-logger';

const router = Router();

router.use(RoutesWrapper.routes()['dungeons&dragons5e'].system);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].realms);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].gods);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].backgrounds);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].feats);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].weapons);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].armors);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].items);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].races);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].classes);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].magicItems);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].spells);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].wikis);
router.use(RoutesWrapper.routes()['dungeons&dragons5e'].monsters);

logger('info', 'Routes reading process - Dungeons & Dragons 5° Edition - DONE');

export default router;
