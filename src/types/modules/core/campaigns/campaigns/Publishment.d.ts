import PublishmentService from 'src/core/campaigns/services/campaigns/PublishmentService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface PublishmentOperationContract {
    publishmentService: PublishmentService;
    logger: Logger;
}

export interface PublishmentServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
