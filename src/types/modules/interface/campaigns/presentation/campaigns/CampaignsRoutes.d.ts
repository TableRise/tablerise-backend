import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';
import AuthorizationMiddleware from 'src/interface/users/middlewares/AuthorizationMiddleware';
import ImageMiddleware from 'src/interface/common/middlewares/ImageMiddleware';
import VerifyMatchMiddleware from 'src/interface/campaigns/middlewares/VerifyMatchMiddleware';

export interface CampaignsRoutesContract {
    campaignsController: CampaignsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    authorizationMiddleware: AuthorizationMiddleware;
    imageMiddleware: ImageMiddleware;
    verifyMatchMiddleware: VerifyMatchMiddleware;
}
