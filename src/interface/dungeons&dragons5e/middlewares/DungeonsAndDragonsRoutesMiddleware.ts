import { Router } from 'express';
import { DungeonsAndDragonsRoutesMiddlewareContract } from 'src/types/modules/interface/dungeons&dragons5e/middlewares/DungeonsAndDragonsRoutesMiddleware';

export default class DungeonsAndDragonsRoutesMiddleware {
    private readonly _routesWrapper;

    constructor({ routesWrapper }: DungeonsAndDragonsRoutesMiddlewareContract) {
        this._routesWrapper = routesWrapper;
    }

    public get(): Router {
        const router = Router();

        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].armors);
        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].backgrounds);
        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].classes);
        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].feats);
        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].gods);
        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].items);
        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].magicItems);
        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].monsters);
        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].races);
        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].realms);
        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].spells);

        return router;
    }
}
