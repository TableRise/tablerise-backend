import sinon from 'sinon';
import UpdateCampaignJournalPostOperation from 'src/core/campaigns/operations/UpdateCampaignJournalPostOperation';

describe('Core :: Campaigns :: Operations :: UpdateCampaignJournalPostOperation', () => {
    it('should persist, sync and emit the updated journal post', async () => {
        const updatedPost = {
            postId: 'post-id',
            title: 'Updated',
            content: 'Updated content',
            author: { userId: 'author-id' },
            timestamp: new Date().toISOString(),
            category: 'players',
        };
        const campaign = { infos: { journal: [updatedPost] } };
        const updateCampaignJournalPostService = {
            updatePost: sinon.stub().resolves({ campaign, updatedPost }),
            save: sinon.stub().resolves(campaign),
        };
        const socketIO = { syncActiveCampaign: sinon.stub(), emitToCampaign: sinon.stub() };
        const operation = new UpdateCampaignJournalPostOperation({
            updateCampaignJournalPostService: updateCampaignJournalPostService as any,
            socketIO: socketIO as any,
            logger: (): void => {},
        });
        const payload = {
            campaignId: 'campaign-id',
            callerId: 'author-id',
            userId: 'author-id',
            postId: 'post-id',
            title: 'Updated',
            post: 'Updated content',
            category: 'players' as const,
        };

        const result = await operation.execute(payload);

        expect(updateCampaignJournalPostService.updatePost).to.have.been.calledWith(payload);
        expect(updateCampaignJournalPostService.save).to.have.been.calledWith(campaign);
        expect(socketIO.syncActiveCampaign).to.have.been.calledWith(campaign);
        expect(socketIO.emitToCampaign).to.have.been.calledWith('campaign-id', 'journal:post_updated', {
            campaignId: 'campaign-id',
            post: updatedPost,
        });
        expect(result).to.be.deep.equal(updatedPost);
    });
});
