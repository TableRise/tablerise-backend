import { Router } from 'express';
import { DungeonsAndDragonsRoutesMiddlewareContract } from 'src/types/dungeons&dragons5e/contracts/middlewares/UsersRoutesMiddleware';

export default class DungeonsAndDragonsRoutesMiddleware {
    private readonly _routesWrapper;

    constructor({ routesWrapper }: DungeonsAndDragonsRoutesMiddlewareContract) {
        this._routesWrapper = routesWrapper;
    }

    public get(): Router {
        const router = Router();

        router.use(this._routesWrapper.routes()['dungeons&dragons5e'].armors);

        return router;
    }
}