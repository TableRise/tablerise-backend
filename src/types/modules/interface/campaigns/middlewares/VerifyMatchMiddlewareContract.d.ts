import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface VerifyMatchMiddlewareContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
