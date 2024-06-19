import PostInvitationEmailService from 'src/core/campaigns/services/PostInvitationEmailService';
import { SchemasCampaignType } from 'src/domains/campaigns/schemas';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import EmailSender from 'src/domains/users/helpers/EmailSender';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface postInvitationEmailOperationContract {
    campaignsSchema: SchemasCampaignType;
    schemaValidator: SchemaValidator;
    postInvitationEmailService: PostInvitationEmailService;
    logger: Logger;
}

export interface PostInvitationEmailServiceContract {
    usersRepository: UsersRepository;
    httpRequestErrors: HttpRequestErrors;
    emailSender: EmailSender;
    logger: Logger;
}
