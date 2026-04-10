import { Router } from 'express';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class UsersRoutesMiddleware {
    private readonly routesWrapper;

    constructor({ routesWrapper }: InterfaceDependencies['usersRoutesMiddlewareContract']) {
        this.routesWrapper = routesWrapper;
    }

    public get(): Router {
        const router = Router();

        router.use(this.routesWrapper.routes().user.oAuth);
        router.use(this.routesWrapper.routes().user.users);

        return router;
    }
}
