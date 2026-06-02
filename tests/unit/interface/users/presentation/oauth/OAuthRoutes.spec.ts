import passport from 'passport';
import sinon from 'sinon';
import AuthErrorMiddleware from 'src/interface/common/middlewares/AuthErrorMiddleware';
import OAuthController from 'src/interface/users/presentation/oauth/OAuthController';
import OAuthRoutes from 'src/interface/users/presentation/oauth/OAuthRoutes';
import { OAuthRoutesContract } from 'src/types/modules/interface/users/presentation/oauth/OAuthRoutes';

describe('Interface :: Users :: Presentation :: Oauth :: OAuthRoutes', () => {
    let oauthRoutes: OAuthRoutes;
    let oAuthController: Record<string, sinon.SinonStub>;
    let authErrorMiddleware: sinon.SinonStub;
    let verifyIdMiddleware: sinon.SinonStub;
    let authenticateStub: sinon.SinonStub;
    let googleMiddleware: sinon.SinonStub;
    let discordMiddleware: sinon.SinonStub;
    let cookieMiddleware: sinon.SinonStub;

    beforeEach(() => {
        oAuthController = {
            google: sinon.stub(),
            discord: sinon.stub(),
            complete: sinon.stub(),
        };
        authErrorMiddleware = sinon.stub();
        verifyIdMiddleware = sinon.stub();
        googleMiddleware = sinon.stub();
        discordMiddleware = sinon.stub();
        cookieMiddleware = sinon.stub();

        oauthRoutes = new OAuthRoutes({
            oAuthController: oAuthController as unknown as OAuthController,
            authErrorMiddleware,
            oAuthSchemas: {
                postCompleteOauthRegister: { body: {} },
            },
            verifyIdMiddleware,
        } as unknown as OAuthRoutesContract);
    });

    afterEach(() => {
        authenticateStub?.restore();
    });

    context('When all the routes are correctly implemented', () => {
        it('should expose the current oauth route table', () => {
            authenticateStub = sinon.stub(passport, 'authenticate').callsFake((strategy: string) => {
                if (strategy === 'google') return googleMiddleware as any;
                if (strategy === 'discord') return discordMiddleware as any;
                return cookieMiddleware as any;
            });

            const routes = oauthRoutes.routes();

            expect(routes).to.have.lengthOf(7);
            expect(routes[0]).to.deep.equal({ basePath: '/oauth' });

            const googleRoute = routes.find((route) => route.path === '/google');
            const googleCallbackRoute = routes.find((route) => route.path === '/google/callback');
            const discordRoute = routes.find((route) => route.path === '/discord');
            const discordCallbackRoute = routes.find((route) => route.path === '/discord/callback');
            const errorRoute = routes.find((route) => route.path === '/error');
            const completeRoute = routes.find((route) => route.path === '/:id/complete');

            expect(googleRoute?.options.middlewares).to.deep.equal([googleMiddleware]);
            expect(googleCallbackRoute?.controller).to.equal(oAuthController.google);
            expect(discordRoute?.options.middlewares).to.deep.equal([discordMiddleware]);
            expect(discordCallbackRoute?.controller).to.equal(oAuthController.discord);
            expect(errorRoute?.options.middlewares).to.deep.equal([authErrorMiddleware]);
            expect(completeRoute?.controller).to.equal(oAuthController.complete);
            expect(completeRoute?.options.middlewares).to.deep.equal([verifyIdMiddleware, cookieMiddleware]);
            expect(authenticateStub.callCount).to.equal(3);
        });

        it('should attach the google oauth user and continue on callback success', () => {
            const req = {} as any;
            const res = { redirect: sinon.stub() } as any;
            const next = sinon.stub();
            const providerUser = { userId: 'google-user' };

            authenticateStub = sinon
                .stub(passport, 'authenticate')
                .callsFake((_strategy: any, _options: any, callback?: any) =>
                    callback
                        ? (innerReq, innerRes, innerNext) => {
                              callback(null, providerUser);
                              return undefined;
                          }
                        : (innerReq, innerRes, innerNext) => undefined
                );

            const routes = oauthRoutes.routes();
            const googleCallbackMiddleware = routes.find((route) => route.path === '/google/callback')?.options
                .middlewares[0];

            googleCallbackMiddleware?.(req, res, next);

            expect(
                authenticateStub
                    .getCalls()
                    .some(
                        (call) =>
                            call.args[0] === 'google' &&
                            call.args[1]?.session === false &&
                            typeof call.args[2] === 'function'
                    )
            ).to.equal(true);
            expect(req.user).to.deep.equal(providerUser);
            expect(next).to.have.been.calledOnce();
            expect(res.redirect).to.not.have.been.called();
        });

        it('should redirect to oauth error when google callback authentication fails', () => {
            const req = {} as any;
            const res = { redirect: sinon.stub() } as any;
            const next = sinon.stub();

            authenticateStub = sinon
                .stub(passport, 'authenticate')
                .callsFake((_strategy: any, _options: any, callback?: any) =>
                    callback
                        ? (innerReq, innerRes, innerNext) => {
                              callback(new Error('oauth-failed'));
                              return undefined;
                          }
                        : (innerReq, innerRes, innerNext) => undefined
                );

            const routes = oauthRoutes.routes();
            const googleCallbackMiddleware = routes.find((route) => route.path === '/google/callback')?.options
                .middlewares[0];

            googleCallbackMiddleware?.(req, res, next);

            expect(res.redirect).to.have.been.calledWith('/oauth/error');
            expect(next).to.not.have.been.called();
        });

        it('should redirect to oauth error when discord callback has no authenticated user', () => {
            const req = {} as any;
            const res = { redirect: sinon.stub() } as any;
            const next = sinon.stub();

            authenticateStub = sinon
                .stub(passport, 'authenticate')
                .callsFake((_strategy: any, _options: any, callback?: any) =>
                    callback
                        ? (innerReq, innerRes, innerNext) => {
                              callback(null, undefined);
                              return undefined;
                          }
                        : (innerReq, innerRes, innerNext) => undefined
                );

            const routes = oauthRoutes.routes();
            const discordCallbackMiddleware = routes.find((route) => route.path === '/discord/callback')?.options
                .middlewares[0];

            discordCallbackMiddleware?.(req, res, next);

            expect(
                authenticateStub
                    .getCalls()
                    .some(
                        (call) =>
                            call.args[0] === 'discord' &&
                            call.args[1]?.session === false &&
                            typeof call.args[2] === 'function'
                    )
            ).to.equal(true);
            expect(res.redirect).to.have.been.calledWith('/oauth/error');
            expect(next).to.not.have.been.called();
        });
    });
});
