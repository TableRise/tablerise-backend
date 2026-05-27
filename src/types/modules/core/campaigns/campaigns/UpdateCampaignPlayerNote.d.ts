import UpdateCampaignPlayerNoteOperation from 'src/core/campaigns/operations/UpdateCampaignPlayerNoteOperation';
import UpdateCampaignPlayerNoteService from 'src/core/campaigns/services/UpdateCampaignPlayerNoteService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateCampaignPlayerNoteOperationContract {
    updateCampaignPlayerNoteService: UpdateCampaignPlayerNoteService;
    logger: Logger;
}

export interface UpdateCampaignPlayerNoteServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}

export { UpdateCampaignPlayerNoteOperation, UpdateCampaignPlayerNoteService };
