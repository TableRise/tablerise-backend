import 'src/interface/users/strategies/GoogleStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import { OAuthRoutesContract } from 'src/types/contracts/users/presentation/OAuthRoutes';

const BASE_PATH = '/oauth';

export default class UsersRoutes {
    private readonly _oAuthController;
    private readonly _verifyIdMiddleware;
    private readonly _authorizationMiddleware;

    constructor({
        oAuthController,
        authorizationMiddleware,
        verifyIdMiddleware,
    }: OAuthRoutesContract) {
        this._oAuthController = oAuthController;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._authorizationMiddleware = authorizationMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}/google`,
                options: {
                    middlewares: [passport.authenticate('google')],
                    authentication: false,
                    tag: 'external',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/google/callback`,
                options: {
                    middlewares: [
                        passport.authenticate('google', {
                            successRedirect: '/auth/google/register',
                            failureRedirect: '/auth/error',
                        }),
                    ],
                    authentication: false,
                    tag: 'external',
                },
                hide: true,
            },
            {
                method: 'get',
                path: `${BASE_PATH}/google/register`,
                controller: this._oAuthController.google,
                options: {
                    authentication: false,
                    tag: 'external',
                },
                hide: true,
            },
        ] as unknown as routeInstance[];
    }
}
