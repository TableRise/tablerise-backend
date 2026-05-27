import GetAllCampaignsService from 'src/core/campaigns/services/GetAllCampaignsService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';
import { GetAllCampaignsQuery } from 'src/types/api/campaigns/http/payload';

export interface GetAllCampaignOperationContract {
    getAllCampaignsService: GetAllCampaignsService;
    logger: Logger;
}

export interface GetAllCampaignsServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}

export type { GetAllCampaignsQuery };
