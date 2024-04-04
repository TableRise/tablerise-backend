import GetAllCampaignsService from 'src/core/campaigns/services/GetAllCampaignsService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetAllCampaignOperationContract {
    getAllCampaignsService: GetAllCampaignsService;
    logger: Logger;
}

export interface GetAllCampaignsServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}