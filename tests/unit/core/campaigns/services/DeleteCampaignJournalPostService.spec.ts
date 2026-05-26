import sinon from 'sinon';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import DeleteCampaignJournalPostService from 'src/core/campaigns/services/DeleteCampaignJournalPostService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Services :: DeleteCampaignJournalPostService', () => {
    let campaign: Campaign;
    let campaignsRepository: any;
    let service: DeleteCampaignJournalPostService;

    const logger = (): void => {};

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: 'author-id',
                characterIds: [],
                role: 'player',
                status: 'active',
            },
            {
                userId: 'admin-id',
                characterIds: [],
                role: 'admin_player',
                status: 'active',
            },
            {
                userId: 'other-id',
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.infos.journal = [
            {
                postId: 'post-id',
                title: 'Old title',
                content: 'Old content',
                author: campaign.campaignPlayers[0],
                timestamp: new Date().toISOString(),
                category: 'players',
            } as any,
        ];
        campaign.infos.highlightedJournal = campaign.infos.journal[0] as any;

        campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        service = new DeleteCampaignJournalPostService({
            campaignsRepository,
            logger,
        } as any);
    });

    it('should allow the author to delete the post and clear the highlighted copy', async () => {
        const result = await service.deletePost({
            campaignId: campaign.campaignId as string,
            callerId: 'author-id',
            userId: 'author-id',
            postId: 'post-id',
        });

        expect(result.deletedPost.postId).to.be.equal('post-id');
        expect(result.campaign.infos.journal).to.have.lengthOf(0);
        expect(result.campaign.infos.highlightedJournal).to.equal(null);
    });

    it('should allow admins to delete another author post', async () => {
        const result = await service.deletePost({
            campaignId: campaign.campaignId as string,
            callerId: 'admin-id',
            userId: 'author-id',
            postId: 'post-id',
        });

        expect(result.campaign.infos.journal).to.have.lengthOf(0);
    });

    it('should reject unrelated players', async () => {
        let thrownError;

        try {
            await service.deletePost({
                campaignId: campaign.campaignId as string,
                callerId: 'other-id',
                userId: 'author-id',
                postId: 'post-id',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.be.equal('The operation is forbidden for this role');
    });

    it('should reject posts that do not belong to the expected author', async () => {
        let thrownError;

        try {
            await service.deletePost({
                campaignId: campaign.campaignId as string,
                callerId: 'admin-id',
                userId: 'other-id',
                postId: 'post-id',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.be.equal('Journal post does not exist');
    });

    it('should reject callers that are not in campaign players', async () => {
        let thrownError;

        try {
            await service.deletePost({
                campaignId: campaign.campaignId as string,
                callerId: 'missing-caller',
                userId: 'author-id',
                postId: 'post-id',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.be.equal('This player is not in the campaign');
    });

    it('should reject missing journal posts', async () => {
        let thrownError;

        try {
            await service.deletePost({
                campaignId: campaign.campaignId as string,
                callerId: 'admin-id',
                userId: 'author-id',
                postId: 'missing-post',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.be.equal('Journal post does not exist');
    });

    it('should keep highlightedJournal untouched when it is not the deleted post object', async () => {
        campaign.infos.highlightedJournal = { title: 'Legacy highlight' } as any;

        const result = await service.deletePost({
            campaignId: campaign.campaignId as string,
            callerId: 'author-id',
            userId: 'author-id',
            postId: 'post-id',
        });

        expect(result.campaign.infos.highlightedJournal).to.deep.equal({ title: 'Legacy highlight' });
    });

    it('should keep highlightedJournal null when there is no highlighted post', async () => {
        campaign.infos.highlightedJournal = null as any;

        const result = await service.deletePost({
            campaignId: campaign.campaignId as string,
            callerId: 'author-id',
            userId: 'author-id',
            postId: 'post-id',
        });

        expect(result.campaign.infos.highlightedJournal).to.equal(null);
    });

    it('should persist campaign updates in save', async () => {
        const result = await service.save(campaign);

        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
        expect(result).to.equal(campaign);
    });
});
