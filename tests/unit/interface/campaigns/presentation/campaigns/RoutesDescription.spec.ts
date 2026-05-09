import desc from 'src/interface/campaigns/presentation/campaigns/RoutesDescription';

describe('Interface :: Campaigns :: Presentation :: RoutesDescription', () => {
    context('When desc object has all route descriptions', () => {
        it('should expose the journal post route descriptions', () => {
            expect(desc).to.have.property('updateCampaignJournalPost');
            expect(desc).to.have.property('deleteCampaignJournalPost');
        });
    });
});
