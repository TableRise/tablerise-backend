import { Router } from 'express';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class CampaignsRoutesMiddleware {
    private readonly _routesWrapper;

    constructor({
        routesWrapper,
    }: InterfaceDependencies['campaignsRoutesMiddlewareContract']) {
        this._routesWrapper = routesWrapper;
    }

    public get(): Router {
        const router = Router();

        router.use(this._routesWrapper.routes().campaign.campaign);

        return router;
    }
}
