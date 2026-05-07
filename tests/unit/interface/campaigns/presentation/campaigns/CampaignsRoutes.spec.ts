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
        imageMiddleware = { multer: () => ({ single: () => {}, fields: () => {} }) };
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
            patchRemoveCampaignPlayerCharacter: { query: {} },
            patchUpdateCampaignImages: { body: {} },
            patchUpdateCampaignPlayerLimit: { query: {} },
            patchUpdateCampaignJournalHighlight: { body: {} },
            patchConfirmCampaignPlayer: { query: {} },
            patchUpdateCampaignCover: { body: {} },
            patchRemoveCampaignImage: { query: {} },
            patchTransferDungeonMaster: { query: {} },
            patchUpdateMatchCharacterPicture: { body: {} },
            getAllCampaigns: { query: {} },
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
            expect(routes).to.have.lengthOf(28);
        });

        it('should include the journal highlight routes', () => {
            const routes = campaignsRoutes.routes();

            expect(routes.some((route) => route.path === '/campaigns/:id/journal/highlight' && route.method === 'get'))
                .to.be.true;
            expect(
                routes.some(
                    (route) => route.path === '/campaigns/:id/update/journal/highlight' && route.method === 'patch'
                )
            ).to.be.true;
        });
    });
});
