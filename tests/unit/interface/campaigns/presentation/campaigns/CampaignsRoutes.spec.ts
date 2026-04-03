import CampaignsRoutes from 'src/interface/campaigns/presentation/campaigns/CampaignsRoutes';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsRoutes', () => {
    let campaignsRoutes: CampaignsRoutes,
        campaignsController: any,
        verifyIdMiddleware: any,
        authorizationMiddleware: any,
        imageMiddleware: any,
        verifyMatchMiddleware: any,
        campaignsSchemas: any;

    context('When all the routes are correctly implemented', () => {
        campaignsController = {};
        verifyIdMiddleware = () => ({});
        imageMiddleware = { multer: () => ({ single: () => {} }) };
        authorizationMiddleware = {};
        verifyMatchMiddleware = { exists: () => {} };
        campaignsSchemas = {
            postCreateCampaign: { body: {} },
            postCreateCampaignPublishment: { body: {} },
            postInvitePlayerByEmail: { query: {} },
            postBanCampaignPlayer: { query: {} },
            postAddCampaignPlayers: { query: {} },
            putUpdateCampaign: { body: {} },
            patchUpdateCampaignMatchMapImages: { body: {} },
            patchUpdateCampaignMatchMusics: { body: {} },
            patchUpdateCampaignMatchDate: { query: {} },
            patchUpdateCampaignPlayerCharacter: { query: {} },
            patchUpdateCampaignImages: { body: {} },
        };

        campaignsRoutes = new CampaignsRoutes({
            campaignsController,
            verifyIdMiddleware,
            imageMiddleware,
            campaignsSchemas,
            authorizationMiddleware,
            verifyMatchMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = campaignsRoutes.routes();
            expect(routes).to.have.lengthOf(15);
        });
    });
});
