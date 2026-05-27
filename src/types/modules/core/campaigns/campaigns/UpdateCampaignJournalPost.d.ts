import UpdateCampaignJournalPostOperation from 'src/core/campaigns/operations/UpdateCampaignJournalPostOperation';
import UpdateCampaignJournalPostService from 'src/core/campaigns/services/UpdateCampaignJournalPostService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateCampaignJournalPostOperationContract {
    updateCampaignJournalPostService: UpdateCampaignJournalPostService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface UpdateCampaignJournalPostServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}

export { UpdateCampaignJournalPostOperation, UpdateCampaignJournalPostService };
