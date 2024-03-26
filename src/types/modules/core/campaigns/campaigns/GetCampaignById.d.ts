import GetCampaignByIdService from 'src/core/campaigns/services/campaigns/GetCampaignByIdService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetCampaignByIdOperationContract {
    getCampaignByIdService: GetCampaignByIdService;
    logger: Logger;
}

export interface GetCampaignByIdServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
