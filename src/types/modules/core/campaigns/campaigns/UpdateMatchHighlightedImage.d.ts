import UpdateMatchHighlightedImageService from 'src/core/campaigns/services/UpdateMatchHighlightedImageService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchHighlightedImageOperationContract {
    updateMatchHighlightedImageService: UpdateMatchHighlightedImageService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface UpdateMatchHighlightedImageServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
