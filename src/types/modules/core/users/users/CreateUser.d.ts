import CreateUserService from 'src/core/users/services/users/CreateUserService';
import { Logger } from '../../../../Logger';
import EmailSender from 'src/domains/users/helpers/EmailSender';
import Serializer from 'src/domains/common/helpers/Serializer';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';

export interface CreateUserOperationContract {
    createUserService: CreateUserService;
    logger: Logger;
}

export interface CreateUserServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    emailSender: EmailSender;
    serializer: Serializer;
    logger: Logger;
}

export type GameInfoOptions = 'badges' | 'campaigns' | 'characters';
