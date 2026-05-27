import TransferDungeonMasterService from 'src/core/campaigns/services/TransferDungeonMasterService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface TransferDungeonMasterOperationContract {
    logger: Logger;
    socketIO: SocketIO;
    transferDungeonMasterService: TransferDungeonMasterService;
}

export interface TransferDungeonMasterServiceContract {
    logger: Logger;
    campaignsRepository: CampaignsRepository;
}
