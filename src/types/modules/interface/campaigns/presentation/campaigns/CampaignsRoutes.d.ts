import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';
import AuthorizationMiddleware from 'src/interface/users/middlewares/AuthorizationMiddleware';
import ImageMiddleware from 'src/interface/users/middlewares/ImageMiddleware';

export interface CampaignsRoutesContract {
    campaignsController: CampaignsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    authorizationMiddleware: AuthorizationMiddleware;
    imageMiddleware: ImageMiddleware;
}