import { Router } from 'express';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class CharactersRoutesMiddleware {
    private readonly _routesWrapper;

    constructor({
        routesWrapper,
    }: InterfaceDependencies['charactersRoutesMiddlewareContract']) {
        this._routesWrapper = routesWrapper;
    }

    public get(): Router {
        const router = Router();

        router.use(this._routesWrapper.routes().character.character);

        return router;
    }
}
