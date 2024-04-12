import UpdateMatchDatesService from 'src/core/campaigns/services/campaigns/UpdateMatchDatesService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchDatesOperationContract {
    updateMatchDatesService: UpdateMatchDatesService;
    logger: Logger;
}

export interface UpdateMatchDatesServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
