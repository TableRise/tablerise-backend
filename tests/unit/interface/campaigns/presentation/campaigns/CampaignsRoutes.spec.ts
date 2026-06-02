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
            postCampaignBuy: { body: {} },
            postAddCampaignPlayers: { query: {} },
            postRemoveCampaignPlayers: { query: {} },
            postConfirmPlayerPresence: { query: {} },
            putUpdateCampaign: { body: {} },
            patchUpdateCampaignMatchMapImages: { body: {} },
            patchAddCampaignMatchMusics: { body: {} },
            patchRemoveCampaignMatchMusic: { body: {} },
            patchEditCampaignMatchMusic: { body: {} },
            patchUpdateCampaignPlayerCharacter: { query: {} },
            patchRemoveCampaignPlayerCharacter: { query: {} },
            patchUpdateCampaignJournalHighlight: { body: {} },
            patchUpdateCampaignPlayerNote: { query: {}, body: {} },
            patchRemoveCampaignPlayerNote: { query: {} },
            patchUpdateCampaignMatchImages: { body: {} },
            patchHighlightCampaignMatchImage: { query: {} },
            patchConfirmCampaignPlayer: { query: {} },
            patchUpdateCampaignCover: { body: {} },
            patchRemoveCampaignMatchMapImage: { query: {} },
            patchTransferDungeonMaster: { query: {} },
            getAllCampaigns: { query: {} },
            patchUpdateCampaignJournalPost: { query: {}, body: {} },
            patchDeleteCampaignJournalPost: { query: {} },
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
            expect(routes).to.have.lengthOf(34);
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
            expect(routes.some((route) => route.path === '/campaigns/:id/update/journal' && route.method === 'patch'))
                .to.be.true;
            expect(routes.some((route) => route.path === '/campaigns/:id/delete/journal' && route.method === 'delete'))
                .to.be.true;
            expect(
                routes.some((route) => route.path === '/campaigns/:id/update/match/images' && route.method === 'patch')
            ).to.be.true;
            expect(
                routes.some(
                    (route) => route.path === '/campaigns/:id/update/match/images/highlight' && route.method === 'patch'
                )
            ).to.be.true;
            expect(routes.some((route) => route.path === '/campaigns/:id/close' && route.method === 'patch')).to.be
                .true;
            expect(routes.some((route) => route.path === '/campaigns/:id/buys' && route.method === 'post')).to.be.true;
            expect(routes.some((route) => route.path === '/campaigns/:id/logs' && route.method === 'post')).to.be.false;
            expect(
                routes.some(
                    (route) => route.path === '/campaigns/:id/update/infos/player-limit' && route.method === 'patch'
                )
            ).to.be.false;
            expect(
                routes.some(
                    (route) => route.path === '/campaigns/:id/update/infos/match-dates/add' && route.method === 'patch'
                )
            ).to.be.false;
            expect(
                routes.some(
                    (route) =>
                        route.path === '/campaigns/:id/update/infos/match-dates/remove' && route.method === 'patch'
                )
            ).to.be.false;
            expect(
                routes.some(
                    (route) =>
                        route.path === '/campaigns/:id/update/match/character/picture' && route.method === 'patch'
                )
            ).to.be.false;
        });
    });
});
