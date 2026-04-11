import AuthErrorMiddleware from 'src/interface/common/middlewares/AuthErrorMiddleware';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';
import OAuthController from 'src/interface/users/presentation/oauth/OAuthController';
import { IOAuthSchemas } from './OAuthSchemas';

export interface OAuthRoutesContract {
    oAuthController: OAuthController;
    oAuthSchemas: IOAuthSchemas;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    authErrorMiddleware: typeof AuthErrorMiddleware;
}
