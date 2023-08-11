import { Router } from "express";
import RoutesWrapper from "src/routes/RoutesWrapper";

const router = Router();

router.use('/system', RoutesWrapper.routes()['dungeons&dragons5e'].system)
router.use('/realms', RoutesWrapper.routes()['dungeons&dragons5e'].realms)
router.use('/gods', RoutesWrapper.routes()['dungeons&dragons5e'].gods)
router.use('/backgrounds', RoutesWrapper.routes()['dungeons&dragons5e'].backgrounds)
router.use('/feats', RoutesWrapper.routes()['dungeons&dragons5e'].feats)
router.use('/weapons', RoutesWrapper.routes()['dungeons&dragons5e'].weapons)
router.use('/armors', RoutesWrapper.routes()['dungeons&dragons5e'].armors)
router.use('/items', RoutesWrapper.routes()['dungeons&dragons5e'].items)
router.use('/races', RoutesWrapper.routes()['dungeons&dragons5e'].races)
router.use('/classes', RoutesWrapper.routes()['dungeons&dragons5e'].classes)
router.use('/magicItems', RoutesWrapper.routes()['dungeons&dragons5e'].magicItems)
router.use('/spells', RoutesWrapper.routes()['dungeons&dragons5e'].spells)
router.use('/wikis', RoutesWrapper.routes()['dungeons&dragons5e'].wikis)
router.use('/monsters', RoutesWrapper.routes()['dungeons&dragons5e'].monsters)

export default router;
