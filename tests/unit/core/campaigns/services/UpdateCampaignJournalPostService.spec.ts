import sinon from 'sinon';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UpdateCampaignJournalPostService from 'src/core/campaigns/services/UpdateCampaignJournalPostService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Services :: UpdateCampaignJournalPostService', () => {
    let campaign: Campaign;
    let campaignsRepository: any;
    let service: UpdateCampaignJournalPostService;

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
                userId: 'dm-id',
                characterIds: [],
                role: 'dungeon_master',
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

        service = new UpdateCampaignJournalPostService({
            campaignsRepository,
            logger,
        } as any);
    });

    it('should allow the author to update the post and the highlighted copy', async () => {
        const originalPost = campaign.infos.journal[0] as any;

        const result = await service.updatePost({
            campaignId: campaign.campaignId as string,
            callerId: 'author-id',
            userId: 'author-id',
            postId: 'post-id',
            title: 'New title',
            post: 'New content',
            category: 'players',
        });

        expect(result.updatedPost).to.include({
            postId: 'post-id',
            title: 'New title',
            content: 'New content',
            category: 'players',
        });
        expect(result.updatedPost.author).to.deep.equal(originalPost.author);
        expect(result.updatedPost.timestamp).to.be.equal(originalPost.timestamp);
        expect((result.campaign.infos.highlightedJournal as any).title).to.be.equal('New title');
        expect((result.campaign.infos.highlightedJournal as any).author).to.deep.equal(originalPost.author);
        expect((result.campaign.infos.highlightedJournal as any).timestamp).to.be.equal(originalPost.timestamp);
    });

    it('should reject non-authors', async () => {
        let thrownError;

        try {
            await service.updatePost({
                campaignId: campaign.campaignId as string,
                callerId: 'dm-id',
                userId: 'author-id',
                postId: 'post-id',
                title: 'New title',
                post: 'New content',
                category: 'players',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.be.equal('The operation is forbidden for this role');
    });

    it('should reject forbidden category updates for players', async () => {
        let thrownError;

        try {
            await service.updatePost({
                campaignId: campaign.campaignId as string,
                callerId: 'author-id',
                userId: 'author-id',
                postId: 'post-id',
                title: 'New title',
                post: 'New content',
                category: 'master',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.be.equal('The post category is forbidden for this role');
    });

    it('should reject posts that do not belong to the expected author', async () => {
        let thrownError;

        try {
            await service.updatePost({
                campaignId: campaign.campaignId as string,
                callerId: 'author-id',
                userId: 'other-user',
                postId: 'post-id',
                title: 'New title',
                post: 'New content',
                category: 'players',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.be.equal('Journal post does not exist');
    });
});
