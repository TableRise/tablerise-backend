import {
    CompleteUserOperationContract,
    CompleteUserServiceContract,
} from './oauth/CompleteUser';
import { OAuthOperationContract, OAuthServiceContract } from './oauth/OAuth';

export default interface OAuthCoreDependencies {
    // Operations
    completeUserOperationContract: CompleteUserOperationContract;
    oAuthOperationContract: OAuthOperationContract;

    // Services
    completeUserServiceContract: CompleteUserServiceContract;
    oAuthServiceContract: OAuthServiceContract;
}
