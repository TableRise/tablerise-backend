import CampaignsRoutes from 'src/interface/campaigns/presentation/campaigns/CampaignsRoutes';

describe('Interface :: Users :: Presentation :: Users :: CampaignsRoutes', () => {
    let campaignsRoutes: CampaignsRoutes,
        campaignsController: any,
        verifyIdMiddleware: any;

    context('When all the routes are correctly implemented', () => {
        campaignsController = {};
        verifyIdMiddleware = () => ({});

        campaignsRoutes = new CampaignsRoutes({
            campaignsController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = campaignsRoutes.routes();
            expect(routes).to.have.lengthOf(2);
        });
    });
});
