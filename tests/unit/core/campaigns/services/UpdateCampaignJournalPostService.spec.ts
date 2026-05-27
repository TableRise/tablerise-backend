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

    it('should reject when the caller is not in the campaign', async () => {
        let thrownError;

        try {
            await service.updatePost({
                campaignId: campaign.campaignId as string,
                callerId: 'missing-id',
                userId: 'author-id',
                postId: 'post-id',
                title: 'New title',
                post: 'New content',
                category: 'players',
            });
        } catch (error) {
            thrownError = error;
        }

        expect((thrownError as HttpRequestErrors).message).to.equal('This player is not in the campaign');
    });

    it('should reject when the target post does not exist', async () => {
        let thrownError;

        try {
            await service.updatePost({
                campaignId: campaign.campaignId as string,
                callerId: 'author-id',
                userId: 'author-id',
                postId: 'missing-post',
                title: 'New title',
                post: 'New content',
                category: 'players',
            });
        } catch (error) {
            thrownError = error;
        }

        expect((thrownError as HttpRequestErrors).message).to.equal('Journal post does not exist');
    });

    it('should update without mutating highlightedJournal when it is not a post object', async () => {
        campaign.infos.highlightedJournal = 'legacy-value' as any;

        const result = await service.updatePost({
            campaignId: campaign.campaignId as string,
            callerId: 'author-id',
            userId: 'author-id',
            postId: 'post-id',
            title: 'New title',
            post: 'New content',
            category: 'players',
        });

        expect(result.updatedPost.title).to.equal('New title');
        expect(result.campaign.infos.highlightedJournal).to.equal('legacy-value');
    });

    it('should ignore highlightedJournal objects with a non-string postId', async () => {
        campaign.infos.highlightedJournal = { postId: 123, title: 'Old highlighted' } as any;

        const result = await service.updatePost({
            campaignId: campaign.campaignId as string,
            callerId: 'author-id',
            userId: 'author-id',
            postId: 'post-id',
            title: 'New title',
            post: 'New content',
            category: 'players',
        });

        expect(result.updatedPost.title).to.equal('New title');
        expect((result.campaign.infos.highlightedJournal as any).title).to.equal('Old highlighted');
    });

    it('should persist the updated campaign', async () => {
        const saved = await service.save(campaign);

        expect(saved).to.deep.equal(campaign);
        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    });

    it('should reject forbidden category updates for dungeon masters', async () => {
        campaign.campaignPlayers = [
            {
                userId: 'dm-id',
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
        ] as any;
        campaign.infos.journal = [
            {
                postId: 'post-id',
                title: 'Old title',
                content: 'Old content',
                author: campaign.campaignPlayers[0],
                timestamp: new Date().toISOString(),
                category: 'master',
            } as any,
        ];

        let thrownError;

        try {
            await service.updatePost({
                campaignId: campaign.campaignId as string,
                callerId: 'dm-id',
                userId: 'dm-id',
                postId: 'post-id',
                title: 'New title',
                post: 'New content',
                category: 'players',
            });
        } catch (error) {
            thrownError = error;
        }

        expect((thrownError as HttpRequestErrors).message).to.equal('The post category is forbidden for this role');
    });

    it('should reject forbidden category updates for admin players', async () => {
        campaign.campaignPlayers = [
            {
                userId: 'admin-id',
                characterIds: [],
                role: 'admin_player',
                status: 'active',
            },
        ] as any;
        campaign.infos.journal = [
            {
                postId: 'post-id',
                title: 'Old title',
                content: 'Old content',
                author: campaign.campaignPlayers[0],
                timestamp: new Date().toISOString(),
                category: 'admin',
            } as any,
        ];

        let thrownError;

        try {
            await service.updatePost({
                campaignId: campaign.campaignId as string,
                callerId: 'admin-id',
                userId: 'admin-id',
                postId: 'post-id',
                title: 'New title',
                post: 'New content',
                category: 'master',
            });
        } catch (error) {
            thrownError = error;
        }

        expect((thrownError as HttpRequestErrors).message).to.equal('The post category is forbidden for this role');
    });

    it('should allow dungeon masters and admin players to update permitted categories', async () => {
        for (const role of ['dungeon_master', 'admin_player'] as const) {
            const currentCampaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
            currentCampaign.campaignPlayers = [
                {
                    userId: `${role}-id`,
                    characterIds: [],
                    role,
                    status: 'active',
                },
            ] as any;
            currentCampaign.infos.journal = [
                {
                    postId: 'post-id',
                    title: 'Old title',
                    content: 'Old content',
                    author: currentCampaign.campaignPlayers[0],
                    timestamp: new Date().toISOString(),
                    category: role === 'dungeon_master' ? 'master' : 'admin',
                } as any,
            ];
            campaignsRepository.findOne = sinon.stub().resolves(currentCampaign);

            const result = await service.updatePost({
                campaignId: currentCampaign.campaignId as string,
                callerId: `${role}-id`,
                userId: `${role}-id`,
                postId: 'post-id',
                title: 'Updated title',
                post: 'Updated content',
                category: role === 'dungeon_master' ? 'master' : 'admin',
            });

            expect(result.updatedPost.title).to.equal('Updated title');
        }
    });
});
