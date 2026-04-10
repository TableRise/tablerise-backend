import { Router } from 'express';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class CharactersRoutesMiddleware {
    private readonly routesWrapper;

    constructor({ routesWrapper }: InterfaceDependencies['charactersRoutesMiddlewareContract']) {
        this.routesWrapper = routesWrapper;
    }

    public get(): Router {
        const router = Router();

        router.use(this.routesWrapper.routes().character.character);

        return router;
    }
}
