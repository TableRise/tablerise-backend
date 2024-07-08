import CampaignsRoutes from 'src/interface/campaigns/presentation/campaigns/CampaignsRoutes';
import VerifyUserMiddleware from 'src/interface/common/middlewares/VerifyUserMiddleware';

export interface CampaignsRoutesBuilderContract {
    campaignsRoutes: CampaignsRoutes;
    verifyUserMiddleware: VerifyUserMiddleware;
}
