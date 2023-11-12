import 'src/interface/users/strategies/GoogleStrategy';
import 'src/interface/users/strategies/FacebookStrategy';
import 'src/interface/users/strategies/DiscordStrategy';
import 'src/interface/common/strategies/BearerStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import { OAuthRoutesContract } from 'src/types/users/contracts/presentation/oauth/OAuthRoutes';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import generateIDParam from 'src/infra/helpers/user/parametersWrapper';

const BASE_PATH = '/oauth';

export default class OAuthRoutes {
    private readonly _oAuthController;
    private readonly _authErrorMiddleware;
    private readonly _verifyIdMiddleware;

    constructor({ oAuthController, verifyIdMiddleware, authErrorMiddleware }: OAuthRoutesContract) {
        this._authErrorMiddleware = authErrorMiddleware;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._oAuthController = oAuthController;
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
                            successRedirect: '/oauth/google/register',
                            failureRedirect: '/oauth/error',
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

            {
                method: 'get',
                path: `${BASE_PATH}/facebook`,
                options: {
                    middlewares: [passport.authenticate('facebook')],
                    authentication: false,
                    tag: 'external',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/facebook/callback`,
                options: {
                    middlewares: [
                        passport.authenticate('facebook', {
                            successRedirect: '/oauth/facebook/register',
                            failureRedirect: '/oauth/error',
                        }),
                    ],
                    authentication: false,
                    tag: 'external',
                },
                hide: true,
            },
            {
                method: 'get',
                path: `${BASE_PATH}/facebook/register`,
                controller: this._oAuthController.facebook,
                options: {
                    authentication: false,
                    tag: 'external',
                },
                hide: true,
            },

            {
                method: 'get',
                path: `${BASE_PATH}/discord`,
                options: {
                    middlewares: [passport.authenticate('discord')],
                    authentication: false,
                    tag: 'external',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/discord/callback`,
                options: {
                    middlewares: [
                        passport.authenticate('discord', {
                            successRedirect: '/oauth/discord/register',
                            failureRedirect: '/oauth/error',
                        }),
                    ],
                    authentication: false,
                    tag: 'external',
                },
                hide: true,
            },
            {
                method: 'get',
                path: `${BASE_PATH}/discord/register`,
                controller: this._oAuthController.discord,
                options: {
                    authentication: false,
                    tag: 'external',
                },
                hide: true,
            },
            {
                method: 'get',
                path: `${BASE_PATH}/error`,
                options: {
                    middlewares: [this._authErrorMiddleware],
                    authentication: false,
                    tag: 'external',
                },
                hide: true,
            },

            {
                method: 'put',
                path: `${BASE_PATH}/:id/complete`,
                parameters: [...generateIDParam()],
                controller: this._oAuthController.complete,
                schema: DomainDataFaker.mocks.completeUserMock,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false })
                    ],
                    authentication: true,
                    tag: 'register',
                },
            },
        ] as unknown as routeInstance[];
    }
}
