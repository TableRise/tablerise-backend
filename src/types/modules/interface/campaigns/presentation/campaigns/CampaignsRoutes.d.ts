import VerifyIdMiddleware from 'src/interface/campaign/middlewares/VerifyIdMiddleware';
import CampaignController from 'src/interface/campaign/presentation/campaign/CampaignController';
import AuthorizationMiddleware from 'src/interface/campaign/middlewares/AuthorizationMiddleware';

export interface CampaignRoutesContract {
    campaignController: CampaignController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    authorizationMiddleware: AuthorizationMiddleware;
}
