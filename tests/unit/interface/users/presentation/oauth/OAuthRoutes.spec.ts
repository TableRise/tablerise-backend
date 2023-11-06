import AuthErrorMiddleware from 'src/interface/users/middlewares/AuthErrorMiddleware';
import OAuthController from 'src/interface/users/presentation/oauth/OAuthController';
import OAuthRoutes from 'src/interface/users/presentation/oauth/OAuthRoutes';
import { OAuthRoutesContract } from 'src/types/users/contracts/presentation/oauth/OAuthRoutes';

describe('Interface :: Users :: Presentation :: Oauth :: OAuthRoutes', () => {
    let oauthRoutes: OAuthRoutes,
        oAuthController,
        authErrorMiddleware;

    context('When all the routes are correctly implemented', () => {
        oAuthController = {} as OAuthController;
        authErrorMiddleware = () => ({}) as typeof AuthErrorMiddleware;

        oauthRoutes = new OAuthRoutes({
            oAuthController,
            authErrorMiddleware
        } as unknown as OAuthRoutesContract);

        it('Should return the correct number of routes', () => {
            const routes = oauthRoutes.routes();
            expect(routes).to.have.lengthOf(10);
        });
    });
});
