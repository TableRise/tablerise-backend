import { Router } from 'express';
import { UsersRoutesMiddlewareContract } from 'src/types/contracts/users/middlewares/UsersRoutesMiddleware';

export default class UsersRoutesMiddleware extends UsersRoutesMiddlewareContract {
    constructor({ routesWrapper }: UsersRoutesMiddlewareContract) {
        super();
        this.routesWrapper = routesWrapper;
    }

    public get(): Router {
        const router = Router();

        router.use(this.routesWrapper.routes().user.profile);

        return router;
    }
}
