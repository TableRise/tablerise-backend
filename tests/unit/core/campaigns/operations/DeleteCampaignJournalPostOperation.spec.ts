import sinon from 'sinon';
import DeleteCampaignJournalPostOperation from 'src/core/campaigns/operations/DeleteCampaignJournalPostOperation';

describe('Core :: Campaigns :: Operations :: DeleteCampaignJournalPostOperation', () => {
    it('should persist, sync and emit the deleted journal post event', async () => {
        const campaign = { campaignId: 'campaign-id', infos: { journal: [] } };
        const deleteCampaignJournalPostService = {
            deletePost: sinon.stub().resolves({ campaign, deletedPost: { postId: 'post-id' } }),
            save: sinon.stub().resolves(campaign),
        };
        const socketIO = { syncActiveCampaign: sinon.stub(), emitToCampaign: sinon.stub() };
        const operation = new DeleteCampaignJournalPostOperation({
            deleteCampaignJournalPostService: deleteCampaignJournalPostService as any,
            socketIO: socketIO as any,
            logger: (): void => {},
        });
        const payload = {
            campaignId: 'campaign-id',
            callerId: 'admin-id',
            userId: 'author-id',
            postId: 'post-id',
        };

        await operation.execute(payload);

        expect(deleteCampaignJournalPostService.deletePost).to.have.been.calledWith(payload);
        expect(deleteCampaignJournalPostService.save).to.have.been.calledWith(campaign);
        expect(socketIO.syncActiveCampaign).to.have.been.calledWith(campaign);
        expect(socketIO.emitToCampaign).to.have.been.calledWith('campaign-id', 'journal:post_deleted', {
            campaignId: 'campaign-id',
            postId: 'post-id',
            userId: 'author-id',
        });
    });
});
