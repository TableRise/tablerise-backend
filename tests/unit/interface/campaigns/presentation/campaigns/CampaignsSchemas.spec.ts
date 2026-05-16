import CampaignsSchemas from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsSchemas', () => {
    context('When the schemas factory is called', () => {
        it('should return object with all expected schema keys', () => {
            const schemas = CampaignsSchemas();

            expect(schemas).to.have.property('postCreateCampaign');
            expect(schemas).to.have.property('putUpdateCampaign');
            expect(schemas).to.have.property('postAddCampaignPlayers');
            expect(schemas).to.have.property('postInvitePlayerByEmail');
            expect(schemas).to.have.property('postCreateCampaignPublishment');
            expect(schemas).to.have.property('patchAddCampaignMatchDate');
            expect(schemas).to.have.property('patchUpdateCampaignMatchMapImages');
            expect(schemas).to.have.property('patchAddCampaignMatchMusics');
            expect(schemas).to.have.property('patchRemoveCampaignMatchMusic');
            expect(schemas).to.have.property('patchEditCampaignMatchMusic');
            expect(schemas).to.have.property('patchUpdateCampaignPlayerCharacter');
            expect(schemas).to.have.property('patchUpdateCampaignJournalHighlight');
            expect(schemas).to.have.property('patchUpdateCampaignJournalPost');
            expect(schemas).to.have.property('patchDeleteCampaignJournalPost');
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

        it('should require configurations in the create campaign payload', () => {
            const schemas = CampaignsSchemas();
            const basePayload = {
                title: 'Campaign',
                description: 'A short description',
                system: 'dnd5e',
                musics: '[]',
                lore: 'A great adventure begins',
                playerAmountLimit: '4',
                ageRestriction: '16',
            };

            expect(() => schemas.postCreateCampaign.body.parse(basePayload)).to.throw();

            expect(() =>
                schemas.postCreateCampaign.body.parse({
                    ...basePayload,
                    configurations: { xpSystem: true, shopSystem: false },
                })
            ).to.not.throw();

            expect(() =>
                schemas.postCreateCampaign.body.parse({
                    ...basePayload,
                    configurations: { xpSystem: 'true', shopSystem: 'false' },
                })
            ).to.not.throw();
        });

        it('should validate update and delete journal post payloads', () => {
            const schemas = CampaignsSchemas();

            expect(() =>
                schemas.patchUpdateCampaignJournalPost.query.parse({
                    userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignJournalPost.body.parse({
                    postId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                    title: 'Session recap',
                    post: 'The ruins are open.',
                    category: 'players',
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchDeleteCampaignJournalPost.query.parse({
                    userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                    postId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                })
            ).to.not.throw();
        });
    });
});
