import { RoutesWrapperContract } from 'src/types/modules/interface/common/RoutesWrapper';
import { AuthorizationMiddlewareContract } from 'src/types/modules/interface/users/middlewares/AuthorizationMiddleware';
import { ImageMiddlewareContract } from 'src/types/modules/interface/users/middlewares/ImageMiddleware';
import { UsersRoutesMiddlewareContract } from 'src/types/modules/interface/users/middlewares/UsersRoutesMiddleware';
import { VerifyEmailCodeMiddlewareContract } from 'src/types/modules/interface/users/middlewares/VerifyEmailCodeMiddleware';
import { UsersRoutesContract } from 'src/types/modules/interface/users/presentation/users/UsersRoutes';
import { UsersControllerContract } from 'src/types/modules/interface/users/presentation/users/UsersController';
import { UsersRoutesBuilderContract } from 'src/types/modules/interface/users/UsersRoutesBuilder';
import { OAuthRoutesContract } from 'src/types/modules/interface/users/presentation/oauth/OAuthRoutes';
import { OAuthControllerContract } from 'src/types/modules/interface/users/presentation/oauth/OAuthController';
import { CampaignsRoutesMiddlewareContract } from 'src/types/modules/interface/campaigns/middlewares/CampaignsRoutesMiddleware';
import { CampaignsRoutesContract } from './campaigns/presentation/campaigns/CampaignsRoutes';

export default interface InterfaceDependencies {
    // <--------- USERS DOMAIN --------->
    // Wrapper
    routesWrapperContract: RoutesWrapperContract;

    // Middlewares
    authorizationMiddlewareContract: AuthorizationMiddlewareContract;
    imageMiddlewareContract: ImageMiddlewareContract;
    usersRoutesMiddlewareContract: UsersRoutesMiddlewareContract;
    verifyEmailCodeMiddlewareContract: VerifyEmailCodeMiddlewareContract;
    campaignsRoutesMiddlewareContract: CampaignsRoutesMiddlewareContract;

    // Routes and Controllers
    campaignsRoutesContract: CampaignsRoutesContract;
    usersRoutesContract: UsersRoutesContract;
    usersControllerContract: UsersControllerContract;
    usersRoutesBuilderContract: UsersRoutesBuilderContract;
    oAuthRoutesContract: OAuthRoutesContract;
    oAuthControllerContract: OAuthControllerContract;
}
