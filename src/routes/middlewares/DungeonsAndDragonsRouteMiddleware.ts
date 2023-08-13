import { Router } from 'express';
import RoutesWrapper from 'src/routes/RoutesWrapper';

const logger = require('@tablerise/dynamic-logger');

const router = Router();

router.use('/dnd5e/system', RoutesWrapper.routes()['dungeons&dragons5e'].system)
router.use('/dnd5e/realms', RoutesWrapper.routes()['dungeons&dragons5e'].realms)
router.use('/dnd5e/gods', RoutesWrapper.routes()['dungeons&dragons5e'].gods)
router.use('/dnd5e/backgrounds', RoutesWrapper.routes()['dungeons&dragons5e'].backgrounds)
router.use('/dnd5e/feats', RoutesWrapper.routes()['dungeons&dragons5e'].feats)
router.use('/dnd5e/weapons', RoutesWrapper.routes()['dungeons&dragons5e'].weapons)
router.use('/dnd5e/armors', RoutesWrapper.routes()['dungeons&dragons5e'].armors)
router.use('/dnd5e/items', RoutesWrapper.routes()['dungeons&dragons5e'].items)
router.use('/dnd5e/races', RoutesWrapper.routes()['dungeons&dragons5e'].races)
router.use('/dnd5e/classes', RoutesWrapper.routes()['dungeons&dragons5e'].classes)
router.use('/dnd5e/magicItems', RoutesWrapper.routes()['dungeons&dragons5e'].magicItems)
router.use('/dnd5e/spells', RoutesWrapper.routes()['dungeons&dragons5e'].spells)
router.use('/dnd5e/wikis', RoutesWrapper.routes()['dungeons&dragons5e'].wikis)
router.use('/dnd5e/monsters', RoutesWrapper.routes()['dungeons&dragons5e'].monsters)

logger('info', 'Routes reading process - Dungeons & Dragons 5° Edition - DONE');

export default router;
