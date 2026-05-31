import passport from 'passport';
import sinon from 'sinon';
import AuthErrorMiddleware from 'src/interface/common/middlewares/AuthErrorMiddleware';
import OAuthController from 'src/interface/users/presentation/oauth/OAuthController';
import OAuthRoutes from 'src/interface/users/presentation/oauth/OAuthRoutes';
import { OAuthRoutesContract } from 'src/types/modules/interface/users/presentation/oauth/OAuthRoutes';

describe('Interface :: Users :: Presentation :: Oauth :: OAuthRoutes', () => {
    let oauthRoutes: OAuthRoutes, oAuthController, authErrorMiddleware;
    let authenticateStub: sinon.SinonStub;

    afterEach(() => {
        authenticateStub?.restore();
    });

    context('When all the routes are correctly implemented', () => {
        oAuthController = {} as OAuthController;
        authErrorMiddleware = () => ({}) as typeof AuthErrorMiddleware;

        const oAuthSchemas = {
            postCompleteOauthRegister: { body: {} },
        };

        oauthRoutes = new OAuthRoutes({
            oAuthController,
            authErrorMiddleware,
            oAuthSchemas,
            verifyIdMiddleware: () => ({}),
        } as unknown as OAuthRoutesContract);

        it('Should return the correct number of routes', () => {
            const routes = oauthRoutes.routes();
            expect(routes).to.have.lengthOf(6);
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
            const googleCallbackMiddleware = routes[1].options.middlewares[0];

            googleCallbackMiddleware(req, res, next);

            expect(authenticateStub).to.have.been.calledWith('google', { session: false }, sinon.match.func);
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
            const googleCallbackMiddleware = routes[1].options.middlewares[0];

            googleCallbackMiddleware(req, res, next);

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
            const discordCallbackMiddleware = routes[3].options.middlewares[0];

            discordCallbackMiddleware(req, res, next);

            expect(authenticateStub).to.have.been.calledWith('discord', { session: false }, sinon.match.func);
            expect(res.redirect).to.have.been.calledWith('/oauth/error');
            expect(next).to.not.have.been.called();
        });
    });
});
