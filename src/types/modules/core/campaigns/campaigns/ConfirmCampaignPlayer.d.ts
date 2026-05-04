import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface ConfirmCampaignPlayerOperationContract {
    logger: Logger;
    confirmCampaignPlayerService: any;
}

export interface ConfirmCampaignPlayerServiceContract {
    logger: Logger;
    campaignsRepository: CampaignsRepository;
}
