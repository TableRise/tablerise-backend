import FriendsOperation from 'src/core/users/operations/users/FriendsOperation';
import FriendsService from 'src/core/users/services/users/FriendsService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface FriendsOperationContract {
    friendsService: FriendsService;
    logger: Logger;
}

export interface FriendsServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
