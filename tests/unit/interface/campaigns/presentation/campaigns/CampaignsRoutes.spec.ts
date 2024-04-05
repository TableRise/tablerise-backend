import CampaignsRoutes from 'src/interface/campaigns/presentation/campaigns/CampaignsRoutes';
import { readdirSync } from 'fs';
const path = 'src/core/campaigns/services';
const filesLength = readdirSync(path).length;

describe('Interface :: Users :: Presentation :: Users :: CampaignsRoutes', () => {
    let campaignsRoutes: CampaignsRoutes,
        campaignsController: any,
        verifyIdMiddleware: any,
        authorizationMiddleware: any,
        imageMiddleware: any;

    context('When all the routes are correctly implemented', () => {
        campaignsController = {};
        verifyIdMiddleware = () => ({});
        imageMiddleware = { multer: () => ({ single: () => {} }) };
        authorizationMiddleware = {};

        campaignsRoutes = new CampaignsRoutes({
            campaignsController,
            verifyIdMiddleware,
            imageMiddleware,
            authorizationMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = campaignsRoutes.routes();
            expect(routes).to.have.lengthOf(filesLength);
        });
    });
});
