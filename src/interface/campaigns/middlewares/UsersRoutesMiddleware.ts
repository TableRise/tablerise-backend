import { Router } from 'express';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class UsersRoutesMiddleware {
    private readonly _routesWrapper;

    constructor({
        routesWrapper,
    }: InterfaceDependencies['usersRoutesMiddlewareContract']) {
        this._routesWrapper = routesWrapper;
    }

    public get(): Router {
        const router = Router();

        router.use(this._routesWrapper.routes().user.oAuth);
        router.use(this._routesWrapper.routes().user.profile);

        return router;
    }
}
