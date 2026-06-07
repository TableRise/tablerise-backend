import MessagesService from 'src/core/users/services/users/MessagesService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface MessagesOperationContract {
    messagesService: MessagesService;
    logger: Logger;
}

export interface MessagesServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
