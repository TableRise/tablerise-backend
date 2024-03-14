import CampaignsRoutes from 'src/interface/campaigns/presentation/campaigns/CampaignsRoutes';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsRoutes', () => {
    let campaignsRoutes: CampaignsRoutes,
        campaignsController: any,
        authorizationMiddleware: any;

    context('When all the routes are correctly implemented', () => {
        campaignsController = {};
        authorizationMiddleware = {};

        campaignsRoutes = new CampaignsRoutes({
            campaignsController,
            authorizationMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = campaignsRoutes.routes();
            expect(routes).to.have.lengthOf(2);
        });
    });
});
