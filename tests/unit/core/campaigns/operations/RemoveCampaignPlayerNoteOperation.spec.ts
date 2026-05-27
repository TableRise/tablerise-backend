import sinon from 'sinon';
import RemoveCampaignPlayerNoteOperation from 'src/core/campaigns/operations/RemoveCampaignPlayerNoteOperation';

describe('Core :: Campaigns :: Operations :: RemoveCampaignPlayerNoteOperation', () => {
    it('should persist the campaign after removing the note', async () => {
        const campaign = {
            campaignPlayers: [
                {
                    userId: 'player-id',
                    notes: [],
                },
            ],
        };
        const removeCampaignPlayerNoteService = {
            removeNote: sinon.stub().resolves(campaign),
            save: sinon.stub().resolves(campaign),
        };
        const operation = new RemoveCampaignPlayerNoteOperation({
            removeCampaignPlayerNoteService: removeCampaignPlayerNoteService as any,
            logger: (): void => {},
        } as any);

        await operation.execute({
            campaignId: 'campaign-id',
            userId: 'player-id',
            title: 'Session Plan',
        });

        expect(removeCampaignPlayerNoteService.removeNote).to.have.been.calledWith({
            campaignId: 'campaign-id',
            userId: 'player-id',
            title: 'Session Plan',
        });
        expect(removeCampaignPlayerNoteService.save).to.have.been.calledWith(campaign);
    });
});
