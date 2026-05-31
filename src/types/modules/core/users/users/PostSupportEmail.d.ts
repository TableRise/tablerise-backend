import PostSupportEmailService from 'src/core/users/services/users/PostSupportEmailService';
import EmailSender from 'src/domains/users/helpers/EmailSender';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface PostSupportEmailOperationContract {
    postSupportEmailService: PostSupportEmailService;
    logger: Logger;
}

export interface PostSupportEmailServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    emailSender: EmailSender;
    logger: Logger;
}
