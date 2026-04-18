import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import ConfirmMatchPlayerPresenceService from 'src/core/campaigns/services/ConfirmMatchPlayerPresenceService';
import { Logger } from 'src/types/shared/logger';

export interface ConfirmMatchPlayerPresenceOperationContract {
    logger: Logger;
    confirmMatchPlayerPresenceService: ConfirmMatchPlayerPresenceService;
}

export interface ConfirmMatchPlayerPresenceServiceContract {
    logger: Logger;
    campaignsRepository: CampaignsRepository;
}
