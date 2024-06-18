import PostInvitationEmailService from 'src/core/campaigns/services/PostInvitationEmailService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import EmailSender from 'src/domains/users/helpers/EmailSender';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface postInvitationEmailOperationContract {
    postInvitationEmailService: PostInvitationEmailService;
    logger: Logger;
}

export interface PostInvitationEmailServiceContract {
    usersRepository: UsersRepository;
    httpRequestErrors: HttpRequestErrors;
    emailSender: EmailSender;
    logger: Logger;
}
