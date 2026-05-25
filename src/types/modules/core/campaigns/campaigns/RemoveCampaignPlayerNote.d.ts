import RemoveCampaignPlayerNoteOperation from 'src/core/campaigns/operations/RemoveCampaignPlayerNoteOperation';
import RemoveCampaignPlayerNoteService from 'src/core/campaigns/services/RemoveCampaignPlayerNoteService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface RemoveCampaignPlayerNoteOperationContract {
    removeCampaignPlayerNoteService: RemoveCampaignPlayerNoteService;
    logger: Logger;
}

export interface RemoveCampaignPlayerNoteServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}

export { RemoveCampaignPlayerNoteOperation, RemoveCampaignPlayerNoteService };
