import GetCampaignByIdService from 'src/core/campaigns/services/GetCampaignByIdService';
import PostInvitationEmailService from 'src/core/campaigns/services/PostInvitationEmailService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import EmailSender from 'src/domains/users/helpers/EmailSender';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface PostInvitationEmailOperationContract {
    getCampaignByIdService: GetCampaignByIdService;
    postInvitationEmailService: PostInvitationEmailService;
    usersRepository: UsersRepository;
    logger: Logger;
}

export interface PostInvitationEmailServiceContract {
    httpRequestErrors: HttpRequestErrors;
    emailSender: EmailSender;
    logger: Logger;
}

export interface CampaignPlayerInvitationPayload {
    campaignId: string;
    targetEmail: string;
}

export interface CampaignPlayerInvitationEmailSend extends CampaignPlayerInvitationPayload {
    userId: string;
    username: string;
}
