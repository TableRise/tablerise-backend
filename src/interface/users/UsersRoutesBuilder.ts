import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

const router = Router();

export default class UsersRoutesBuilder {
    private readonly _usersRoutes;
    private readonly _oAuthRoutes;

    constructor({
        usersRoutes,
        oAuthRoutes,
    }: InterfaceDependencies['usersRoutesBuilderContract']) {
        this._usersRoutes = usersRoutes;
        this._oAuthRoutes = oAuthRoutes;
    }

    private _profile(): { profileRoutes: Router; profileSwagger: routeInstance[] } {
        const profileRoutes = buildRouter(this._usersRoutes.routes(), router);
        const profileSwagger = this._usersRoutes.routes();

        return { profileRoutes, profileSwagger };
    }

    private _oAuth(): { oAuthRoutes: Router; oAuthSwagger: routeInstance[] } {
        const oAuthRoutes = buildRouter(this._oAuthRoutes.routes(), router);
        const oAuthSwagger = this._oAuthRoutes.routes();

        return { oAuthRoutes, oAuthSwagger };
    }

    public get(): {
        usersSwagger: routeInstance[];
        usersRoutes: { profile: Router; oAuth: Router };
    } {
        const usersSwagger = [
            ...this._oAuth().oAuthSwagger,
            ...this._profile().profileSwagger,
        ];
        const usersRoutes = {
            profile: this._profile().profileRoutes,
            oAuth: this._oAuth().oAuthRoutes,
        };

        return { usersSwagger, usersRoutes };
    }
}
