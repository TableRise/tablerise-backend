import { Router } from 'express';
import { UsersRoutesMiddlewareContract } from 'src/types/users/contracts/middlewares/UsersRoutesMiddleware';

export default class UsersRoutesMiddleware {
    private readonly _routesWrapper;

    constructor({ routesWrapper }: UsersRoutesMiddlewareContract) {
        this._routesWrapper = routesWrapper;
    }

    public get(): Router {
        const router = Router();

        router.use(this._routesWrapper.routes().user.oAuth);
        router.use(this._routesWrapper.routes().user.profile);

        return router;
    }
}