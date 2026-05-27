import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import TokenForbidden from 'src/domains/common/helpers/TokenForbidden';
import { Logger } from 'src/types/shared/logger';

export interface SocketIOContract {
    campaignsRepository: CampaignsRepository;
    tokenForbidden: TokenForbidden;
    redisClient: any;
    logger: Logger;
}
