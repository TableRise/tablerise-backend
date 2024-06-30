import OAuthService from 'src/core/users/services/oauth/OAuthService';
import Serializer from 'src/domains/common/helpers/Serializer';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface OAuthOperationContract {
    oAuthService: OAuthService;
    usersRepository: UsersRepository;
    logger: Logger;
}

export interface OAuthServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    serializer: Serializer;
    logger: Logger;
}
