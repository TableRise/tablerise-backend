import 'src/interface/users/strategies/GoogleStrategy';
import 'src/interface/users/strategies/DiscordStrategy';
import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import generateIDParam from 'src/domains/common/helpers/parametersWrapper';
import desc from 'src/interface/users/presentation/oauth/RoutesDescription';

const BASE_PATH = '/oauth';

export default class OAuthRoutes {
    private readonly oAuthController;
    private readonly authErrorMiddleware;
    private readonly verifyIdMiddleware;

    constructor({
        oAuthController,
        verifyIdMiddleware,
        authErrorMiddleware,
    }: InterfaceDependencies['oAuthRoutesContract']) {
        this.authErrorMiddleware = authErrorMiddleware;
        this.verifyIdMiddleware = verifyIdMiddleware;
        this.oAuthController = oAuthController;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}/google`,
                options: {
                    middlewares: [passport.authenticate('google')],
                    tag: 'external',
                    description: desc.google,
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
                    tag: 'external',
                },
                hide: true,
            },
            {
                method: 'get',
                path: `${BASE_PATH}/google/register`,
                controller: this.oAuthController.google,
                options: {
                    tag: 'external',
                },
                hide: true,
            },

            {
                method: 'get',
                path: `${BASE_PATH}/discord`,
                options: {
                    middlewares: [passport.authenticate('discord', { passReqToCallback: true })],
                    tag: 'external',
                    description: desc.discord,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/discord/callback`,
                options: {
                    middlewares: [
                        passport.authenticate('discord', {
                            keepSessionInfo: true,
                            passReqToCallback: true,
                            successRedirect: '/oauth/discord/register',
                            failureRedirect: '/oauth/error',
                        }),
                    ],
                    tag: 'external',
                },
                hide: true,
            },
            {
                method: 'get',
                path: `${BASE_PATH}/discord/register`,
                controller: this.oAuthController.discord,
                options: {
                    tag: 'external',
                },
                hide: true,
            },
            {
                method: 'get',
                path: `${BASE_PATH}/error`,
                options: {
                    middlewares: [this.authErrorMiddleware],
                    tag: 'external',
                },
                hide: true,
            },

            {
                method: 'put',
                path: `${BASE_PATH}/:id/complete`,
                parameters: [...generateIDParam()],
                controller: this.oAuthController.complete,
                schema: DomainDataFaker.mocks.completeUserMock,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'register',
                    description: desc.confirmExternal,
                },
            },
        ] as unknown as routeInstance[];
    }
}
