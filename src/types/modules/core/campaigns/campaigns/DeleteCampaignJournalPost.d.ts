import DeleteCampaignJournalPostOperation from 'src/core/campaigns/operations/DeleteCampaignJournalPostOperation';
import DeleteCampaignJournalPostService from 'src/core/campaigns/services/DeleteCampaignJournalPostService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface DeleteCampaignJournalPostOperationContract {
    deleteCampaignJournalPostService: DeleteCampaignJournalPostService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface DeleteCampaignJournalPostServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}

export { DeleteCampaignJournalPostOperation, DeleteCampaignJournalPostService };
