import AuthorizationMiddleware from 'src/interface/users/middlewares/AuthorizationMiddleware';
import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';
import OAuthController from 'src/interface/users/presentation/oauth/OAuthController';

export interface OAuthRoutesContract {
    oAuthController: OAuthController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    authorizationMiddleware: AuthorizationMiddleware;
}
