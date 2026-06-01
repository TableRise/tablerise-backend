import CampaignsRoutes from 'src/interface/campaigns/presentation/campaigns/CampaignsRoutes';

describe('Interface :: Campaigns :: Presentation :: Campaign Player Notes :: CampaignsRoutes', () => {
    it('should register the campaign player note update and remove routes', () => {
        const routes = new CampaignsRoutes({
            campaignsController: {},
            verifyIdMiddleware: () => ({}),
            imageMiddleware: { multer: () => ({ single: () => {}, fields: () => {} }), fileType: () => {} },
            verifyMatchMiddleware: { exists: () => {} },
            campaignsSchemas: {
                postCreateCampaign: { body: {} },
                postCreateCampaignPublishment: { body: {} },
                postCampaignLog: { body: {} },
                postCampaignBuy: { body: {} },
                postAddCampaignPlayers: { query: {} },
                putUpdateCampaign: { body: {} },
                patchUpdateCampaignMatchMapImages: { body: {} },
                patchUpdateCampaignMatchImages: { body: {} },
                patchHighlightCampaignMatchImage: { query: {} },
                patchAddCampaignMatchMusics: { body: {} },
                patchRemoveCampaignMatchMusic: { body: {} },
                patchEditCampaignMatchMusic: { body: {} },
                patchAddCampaignMatchDate: { query: {} },
                patchUpdateCampaignPlayerCharacter: { query: {} },
                patchRemoveCampaignPlayerCharacter: { query: {} },
                patchUpdateCampaignPlayerLimit: { query: {} },
                getAllCampaigns: { query: {} },
                postConfirmPlayerPresence: { query: {} },
                patchConfirmCampaignPlayer: { query: {} },
                patchUpdateCampaignCover: { body: {} },
                patchRemoveCampaignMatchMapImage: { query: {} },
                patchTransferDungeonMaster: { query: {} },
                patchUpdateMatchCharacterPicture: { body: {} },
                patchUpdateCampaignJournalHighlight: { body: {} },
                patchUpdateCampaignJournalPost: { query: {}, body: {} },
                patchDeleteCampaignJournalPost: { query: {} },
                patchUpdateCampaignPlayerNote: { query: {}, body: {} },
                patchRemoveCampaignPlayerNote: { query: {} },
            },
        } as any).routes();

        expect(routes.some((route) => route.method === 'patch' && route.path === '/campaigns/:id/update/notes')).to.be
            .true;
        expect(routes.some((route) => route.method === 'patch' && route.path === '/campaigns/:id/update/notes/remove'))
            .to.be.true;
    });
});
