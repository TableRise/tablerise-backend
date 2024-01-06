import { RoutesWrapperContract } from 'src/types/modules/common/RoutesWrapper';
import { AuthorizationMiddlewareContract } from 'src/types/modules/users/middlewares/AuthorizationMiddleware';
import { ImageMiddlewareContract } from 'src/types/modules/users/middlewares/ImageMiddleware';
import { UsersRoutesMiddlewareContract } from 'src/types/modules/users/middlewares/UsersRoutesMiddleware';
import { VerifyEmailCodeMiddlewareContract } from 'src/types/modules/users/middlewares/VerifyEmailCodeMiddleware';
import { UsersRoutesContract } from 'src/types/modules/users/presentation/users/UsersRoutes';
import { UsersControllerContract } from 'src/types/modules/users/presentation/users/UsersController';
import { UsersRoutesBuilderContract } from 'src/types/modules/users/UsersRoutesBuilder';
import { OAuthRoutesContract } from 'src/types/modules/users/presentation/oauth/OAuthRoutes';
import { OAuthControllerContract } from 'src/types/modules/users/presentation/oauth/OAuthController';

export default interface InterfaceDependencies {
    // <--------- USERS DOMAIN --------->
    // Wrapper
    routesWrapperContract: RoutesWrapperContract;

    // Middlewares
    authorizationMiddlewareContract: AuthorizationMiddlewareContract;
    imageMiddlewareContract: ImageMiddlewareContract;
    usersRoutesMiddlewareContract: UsersRoutesMiddlewareContract;
    verifyEmailCodeMiddlewareContract: VerifyEmailCodeMiddlewareContract;

    // Routes and Controllers
    usersRoutesContract: UsersRoutesContract;
    usersControllerContract: UsersControllerContract;
    usersRoutesBuilderContract: UsersRoutesBuilderContract;
    oAuthRoutesContract: OAuthRoutesContract;
    oAuthControllerContract: OAuthControllerContract;
}
