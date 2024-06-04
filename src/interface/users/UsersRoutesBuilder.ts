import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import bindMiddleware from 'src/domains/common/helpers/bindMiddleware';

const router = Router();

const ROUTES_WITH_NO_VERIFY = [
    '/register',
    '/login',
    '/:id/update',
    '/verify',
    '/:id/delete',
];

export default class UsersRoutesBuilder {
    private readonly _usersRoutes;
    private readonly _oAuthRoutes;
    private readonly _verifyUserMiddleware;

    constructor({
        usersRoutes,
        oAuthRoutes,
        verifyUserMiddleware,
    }: InterfaceDependencies['usersRoutesBuilderContract']) {
        this._usersRoutes = usersRoutes;
        this._oAuthRoutes = oAuthRoutes;
        this._verifyUserMiddleware = verifyUserMiddleware;
    }

    private _profile(): { profileRoutes: Router; profileSwagger: routeInstance[] } {
        const usersRoutesToBuild = bindMiddleware(
            this._verifyUserMiddleware.userStatus,
            this._usersRoutes.routes(),
            {
                substringLoc: 6,
                addMethod: 'push',
                pathsToIgnore: ROUTES_WITH_NO_VERIFY,
            }
        );

        const profileRoutes = buildRouter(usersRoutesToBuild, router);
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
