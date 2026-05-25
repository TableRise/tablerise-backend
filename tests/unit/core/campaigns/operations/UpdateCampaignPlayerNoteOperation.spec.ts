import sinon from 'sinon';
import UpdateCampaignPlayerNoteOperation from 'src/core/campaigns/operations/UpdateCampaignPlayerNoteOperation';

describe('Core :: Campaigns :: Operations :: UpdateCampaignPlayerNoteOperation', () => {
    it('should persist the campaign and return the updated note', async () => {
        const campaign = {
            campaignPlayers: [
                {
                    userId: 'player-id',
                    notes: [{ title: 'Session Plan', content: 'New content' }],
                },
            ],
        };
        const updateCampaignPlayerNoteService = {
            updateNote: sinon.stub().resolves({
                campaign,
                updatedNote: { title: 'Session Plan', content: 'New content' },
            }),
            save: sinon.stub().resolves(campaign),
        };
        const operation = new UpdateCampaignPlayerNoteOperation({
            updateCampaignPlayerNoteService: updateCampaignPlayerNoteService as any,
            logger: (): void => {},
        } as any);

        const result = await operation.execute({
            campaignId: 'campaign-id',
            userId: 'player-id',
            title: 'Session Plan',
            content: 'New content',
        });

        expect(updateCampaignPlayerNoteService.updateNote).to.have.been.calledWith({
            campaignId: 'campaign-id',
            userId: 'player-id',
            title: 'Session Plan',
            content: 'New content',
        });
        expect(updateCampaignPlayerNoteService.save).to.have.been.calledWith(campaign);
        expect(result).to.deep.equal({ title: 'Session Plan', content: 'New content' });
    });
});
