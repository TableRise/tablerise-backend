import AuthErrorMiddleware from 'src/interface/users/middlewares/AuthErrorMiddleware';
import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';
import OAuthController from 'src/interface/users/presentation/oauth/OAuthController';

export interface OAuthRoutesContract {
    oAuthController: OAuthController;
    authErrorMiddleware: typeof AuthErrorMiddleware;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
