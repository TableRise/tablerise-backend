import { AuthorizationMiddlewareContract } from 'src/types/modules/interface/common/middlewares/AuthorizationMiddleware';
import { ImageMiddlewareContract } from 'src/types/modules/interface/common/middlewares/ImageMiddleware';
import { VerifyUserMiddlewareContract } from 'src/types/modules/interface/common/middlewares/VerifyUserMiddleware';
import { StateMachineFlowsMiddlewareContract } from 'src/types/modules/interface/common/middlewares/StateMachineFlowsMiddleware';
import { VerifyEmailCodeMiddlewareContract } from 'src/types/modules/interface/users/middlewares/VerifyEmailCodeMiddleware';
import { UsersRoutesContract } from 'src/types/modules/interface/users/presentation/users/UsersRoutes';
import { UsersControllerContract } from 'src/types/modules/interface/users/presentation/users/UsersController';
import { OAuthRoutesContract } from 'src/types/modules/interface/users/presentation/oauth/OAuthRoutes';
import { OAuthControllerContract } from 'src/types/modules/interface/users/presentation/oauth/OAuthController';
import { CampaignsRoutesContract } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsRoutes';
import { CampaignsControllerContract } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsController.d';
import { VerifyMatchMiddlewareContract } from 'src/types/modules/interface/campaigns/middlewares/VerifyMatchMiddlewareContract';
import { CharactersRoutesContract } from './characters/presentation/characters/CharactersRoutes';
import { CharactersControllerContract } from './characters/presentation/characters/CharactersController';
import { LoginPassportContract } from './users/strategies/LocalStrategy';

export default interface InterfaceDependencies {
    // <--------- USERS DOMAIN --------->
    authorizationMiddlewareContract: AuthorizationMiddlewareContract;
    stateMachineFlowsMiddlewareContract: StateMachineFlowsMiddlewareContract;
    imageMiddlewareContract: ImageMiddlewareContract;
    verifyEmailCodeMiddlewareContract: VerifyEmailCodeMiddlewareContract;
    verifyUserMiddlewareContract: VerifyUserMiddlewareContract;
    localStrategy: LoginPassportContract;

    usersRoutesContract: UsersRoutesContract;
    usersControllerContract: UsersControllerContract;
    oAuthRoutesContract: OAuthRoutesContract;
    oAuthControllerContract: OAuthControllerContract;

    // <--------- CAMPAIGNS DOMAIN --------->
    campaignsRoutesContract: CampaignsRoutesContract;
    campaignsControllerContract: CampaignsControllerContract;
    verifyMatchMiddlewareContract: VerifyMatchMiddlewareContract;

    // <--------- CHARACTERS DOMAIN --------->
    charactersRoutesContract: CharactersRoutesContract;
    charactersControllerContract: CharactersControllerContract;
}
