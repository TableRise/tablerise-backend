import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import bindUserStatusMiddleware from 'src/domains/common/helpers/bindUserStatusMiddleware';

const router = Router();

const ROUTES_WITH_NO_VERIFY = [
    '/register',
    '/start-machine-flow',
    '/login',
    '/logout',
    '/authenticate/email/send-code',
    '/:id/delete',
    '/authenticate/email',
    '/authenticate/2fa',
    '/update/password',
];

export default class UsersRoutesBuilder {
    private readonly usersRoutes;
    private readonly oAuthRoutes;
    private readonly verifyUserMiddleware;

    constructor({
        usersRoutes,
        oAuthRoutes,
        verifyUserMiddleware,
    }: InterfaceDependencies['usersRoutesBuilderContract']) {
        this.usersRoutes = usersRoutes;
        this.oAuthRoutes = oAuthRoutes;
        this.verifyUserMiddleware = verifyUserMiddleware;
    }

    private users(): { usersRoutes: Router; usersSwagger: routeInstance[] } {
        const usersRoutesToBuild = bindUserStatusMiddleware(
            this.verifyUserMiddleware.userStatus,
            this.usersRoutes.routes(),
            {
                substringLoc: 6,
                addMethod: 'push',
                pathsToIgnore: ROUTES_WITH_NO_VERIFY,
            }
        );

        const usersRoutes = buildRouter(usersRoutesToBuild, router);
        const usersSwagger = this.usersRoutes.routes();

        return { usersRoutes, usersSwagger };
    }

    private oAuth(): { oAuthRoutes: Router; oAuthSwagger: routeInstance[] } {
        const oAuthRoutes = buildRouter(this.oAuthRoutes.routes(), router);
        const oAuthSwagger = this.oAuthRoutes.routes();

        return { oAuthRoutes, oAuthSwagger };
    }

    public get(): {
        usersSwagger: routeInstance[];
        usersRoutes: { users: Router; oAuth: Router };
    } {
        const usersSwagger = [...this.oAuth().oAuthSwagger, ...this.users().usersSwagger];
        const usersRoutes = {
            users: this.users().usersRoutes,
            oAuth: this.oAuth().oAuthRoutes,
        };

        return { usersSwagger, usersRoutes };
    }
}
