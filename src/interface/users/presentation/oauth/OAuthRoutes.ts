import 'src/interface/users/strategies/GoogleStrategy';
import 'src/interface/users/strategies/DiscordStrategy';
import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { routeInstance } from '@tablerise/auto-swagger';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import generateIDParam from 'src/domains/common/helpers/parametersWrapper';
import desc from 'src/interface/users/presentation/oauth/RoutesDescription';

const BASE_PATH = '/oauth';

export default class OAuthRoutes {
    private readonly oAuthController;
    private readonly oAuthSchemas;
    private readonly authErrorMiddleware;
    private readonly verifyIdMiddleware;

    constructor({
        oAuthController,
        oAuthSchemas,
        verifyIdMiddleware,
        authErrorMiddleware,
    }: InterfaceDependencies['oAuthRoutesContract']) {
        this.authErrorMiddleware = authErrorMiddleware;
        this.verifyIdMiddleware = verifyIdMiddleware;
        this.oAuthController = oAuthController;
        this.oAuthSchemas = oAuthSchemas;

        this.authenticateGoogleCallback = this.authenticateGoogleCallback.bind(this);
        this.authenticateDiscordCallback = this.authenticateDiscordCallback.bind(this);
    }

    private authenticateGoogleCallback(req: Request, res: Response, next: NextFunction): void {
        this.authenticateExternalProvider('google', req, res, next);
    }

    private authenticateDiscordCallback(req: Request, res: Response, next: NextFunction): void {
        this.authenticateExternalProvider('discord', req, res, next);
    }

    private authenticateExternalProvider(
        provider: 'google' | 'discord',
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        passport.authenticate(provider, { session: false }, (error: Error | null, user?: Express.User) => {
            if (error ?? !user) {
                res.redirect('/oauth/error');
                return;
            }

            req.user = user;
            next();
        })(req, res, next);
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}/google`,
                options: {
                    middlewares: [passport.authenticate('google', { session: false })],
                    tag: 'external',
                    description: desc.google,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/google/callback`,
                controller: this.oAuthController.google,
                options: {
                    middlewares: [this.authenticateGoogleCallback],
                    tag: 'external',
                },
                hide: true,
            },

            {
                method: 'get',
                path: `${BASE_PATH}/discord`,
                options: {
                    middlewares: [passport.authenticate('discord', { session: false })],
                    tag: 'external',
                    description: desc.discord,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/discord/callback`,
                controller: this.oAuthController.discord,
                options: {
                    middlewares: [this.authenticateDiscordCallback],
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
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'register',
                    schemas: [{ body: this.oAuthSchemas.postCompleteOauthRegister.body }],
                    description: desc.confirmExternal,
                },
            },
        ] as unknown as routeInstance[];
    }
}
