import UpdateCampaignJournalHighlightOperation from 'src/core/campaigns/operations/UpdateCampaignJournalHighlightOperation';
import UpdateCampaignJournalHighlightService from 'src/core/campaigns/services/UpdateCampaignJournalHighlightService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateCampaignJournalHighlightOperationContract {
    updateCampaignJournalHighlightService: UpdateCampaignJournalHighlightService;
    logger: Logger;
}

export interface UpdateCampaignJournalHighlightServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
    socketIO: SocketIO;
}
