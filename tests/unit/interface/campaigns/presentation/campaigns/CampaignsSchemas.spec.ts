import CampaignsSchemas from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsSchemas', () => {
    context('When the schemas factory is called', () => {
        it('should return object with all expected schema keys', () => {
            const schemas = CampaignsSchemas();

            expect(schemas).to.have.property('postCreateCampaign');
            expect(schemas).to.have.property('putUpdateCampaign');
            expect(schemas).to.have.property('postAddCampaignPlayers');
            expect(schemas).to.have.property('postBanCampaignPlayer');
            expect(schemas).to.have.property('postInvitePlayerByEmail');
            expect(schemas).to.have.property('postCreateCampaignPublishment');
            expect(schemas).to.have.property('patchUpdateCampaignMatchDate');
            expect(schemas).to.have.property('patchUpdateCampaignMatchMapImages');
            expect(schemas).to.have.property('patchUpdateCampaignMatchMusics');
            expect(schemas).to.have.property('patchUpdateCampaignPlayerCharacter');
            expect(schemas).to.have.property('patchUpdateCampaignImages');
            expect(schemas).to.have.property('patchUpdateCampaignJournalHighlight');
        });

        it('should validate highlighted journal payload rules', () => {
            const schemas = CampaignsSchemas();
            const validPost = {
                title: 'Session recap',
                author: {
                    userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                    characterIds: [],
                    role: 'dungeon_master',
                    status: 'active',
                },
                content: 'The party reached the ruins.',
                timestamp: new Date().toISOString(),
                category: 'master',
            };

            expect(() =>
                schemas.patchUpdateCampaignJournalHighlight.body.parse({
                    toggle: 'off',
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignJournalHighlight.body.parse({
                    toggle: 'on',
                    post: validPost,
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignJournalHighlight.body.parse({
                    toggle: 'on',
                })
            ).to.throw();
        });
    });
});
