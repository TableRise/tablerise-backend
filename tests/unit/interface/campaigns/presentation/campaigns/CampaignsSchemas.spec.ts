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
        });
    });
});
