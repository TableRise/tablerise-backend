import sinon from 'sinon';
import UpdateCampaignJournalHighlightOperation from 'src/core/campaigns/operations/UpdateCampaignJournalHighlightOperation';

describe('Core :: Campaigns :: Operations :: UpdateCampaignJournalHighlightOperation', () => {
    it('should delegate the payload to the service', async () => {
        const payload = {
            campaignId: 'campaign-id',
            userId: 'user-id',
            toggle: 'off' as const,
        };
        const updateCampaignJournalHighlightService = {
            updateHighlight: sinon.stub().resolves({}),
        };
        const operation = new UpdateCampaignJournalHighlightOperation({
            updateCampaignJournalHighlightService: updateCampaignJournalHighlightService as any,
            logger: (): void => {},
        });

        const result = await operation.execute(payload);

        expect(updateCampaignJournalHighlightService.updateHighlight).to.have.been.calledWith(payload);
        expect(result).to.be.deep.equal({});
    });
});
