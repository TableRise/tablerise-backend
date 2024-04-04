import UpdateMatchMusicsService from 'src/core/campaigns/services/campaigns/UpdateMatchMusicsService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchMusicsOperationContract {
    updateMatchMusicsService: UpdateMatchMusicsService;
    logger: Logger;
}

export interface UpdateMatchMusicsServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
