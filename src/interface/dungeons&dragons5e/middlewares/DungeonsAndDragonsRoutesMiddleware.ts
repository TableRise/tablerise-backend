import { Router } from 'express';
import { DungeonsAndDragonsRoutesMiddlewareContract } from 'src/types/modules/interface/dungeons&dragons5e/middlewares/DungeonsAndDragonsRoutesMiddleware';

export default class DungeonsAndDragonsRoutesMiddleware {
    private readonly routesWrapper;

    constructor({ routesWrapper }: DungeonsAndDragonsRoutesMiddlewareContract) {
        this.routesWrapper = routesWrapper;
    }

    public get(): Router {
        const router = Router();

        router.use(this.routesWrapper.routes()['dungeons&dragons5e'].armors);
        router.use(this.routesWrapper.routes()['dungeons&dragons5e'].backgrounds);
        router.use(this.routesWrapper.routes()['dungeons&dragons5e'].classes);
        router.use(this.routesWrapper.routes()['dungeons&dragons5e'].feats);
        router.use(this.routesWrapper.routes()['dungeons&dragons5e'].gods);
        router.use(this.routesWrapper.routes()['dungeons&dragons5e'].items);
        router.use(this.routesWrapper.routes()['dungeons&dragons5e'].magicItems);
        router.use(this.routesWrapper.routes()['dungeons&dragons5e'].monsters);
        router.use(this.routesWrapper.routes()['dungeons&dragons5e'].races);
        router.use(this.routesWrapper.routes()['dungeons&dragons5e'].realms);
        router.use(this.routesWrapper.routes()['dungeons&dragons5e'].spells);

        return router;
    }
}
