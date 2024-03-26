import VerifyIdMiddleware from 'src/interface/campaign/middlewares/VerifyIdMiddleware';
import CampaignController from 'src/interface/campaign/presentation/campaign/CampaignController';
import AuthorizationMiddleware from 'src/interface/campaign/middlewares/AuthorizationMiddleware';
import ImageMiddleware from 'src/interface/users/middlewares/ImageMiddleware';

export interface CampaignsRoutesContract {
    campaignsController: CampaignController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    authorizationMiddleware: AuthorizationMiddleware;
    imageMiddleware: ImageMiddleware;
}
