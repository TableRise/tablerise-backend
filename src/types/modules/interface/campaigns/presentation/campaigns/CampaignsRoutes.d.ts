import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';

export interface CampaignsRoutesContract {
    campaignsController: CampaignsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
