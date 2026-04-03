import PostBanPlayerService from 'src/core/campaigns/services/PostBanPlayerService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface PostBanPlayerOperationContract {
    postBanPlayerService: PostBanPlayerService;
    logger: Logger;
}

export interface PostBanPlayerServiceContract {
    httpRequestErrors: HttpRequestErrors;
    usersDetailsRepository: UsersDetailsRepository;
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
