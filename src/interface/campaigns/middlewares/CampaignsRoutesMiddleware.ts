import { Router } from 'express';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class CampaignsRoutesMiddleware {
    private readonly routesWrapper;

    constructor({ routesWrapper }: InterfaceDependencies['campaignsRoutesMiddlewareContract']) {
        this.routesWrapper = routesWrapper;
    }

    public get(): Router {
        const router = Router();

        router.use(this.routesWrapper.routes().campaign.campaign);

        return router;
    }
}
