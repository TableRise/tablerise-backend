import AuthErrorMiddleware from 'src/interface/common/middlewares/AuthErrorMiddleware';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';
import OAuthController from 'src/interface/users/presentation/oauth/OAuthController';

export interface OAuthRoutesContract {
    oAuthController: OAuthController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    authErrorMiddleware: typeof AuthErrorMiddleware;
}
