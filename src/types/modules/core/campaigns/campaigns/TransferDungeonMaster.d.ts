import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface TransferDungeonMasterOperationContract {
    logger: Logger;
    transferDungeonMasterService: any;
}

export interface TransferDungeonMasterServiceContract {
    logger: Logger;
    campaignsRepository: CampaignsRepository;
}
