import sinon from 'sinon';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UpdateCampaignJournalHighlightService from 'src/core/campaigns/services/UpdateCampaignJournalHighlightService';

describe('Core :: Campaigns :: Services :: UpdateCampaignJournalHighlightService', () => {
    let campaign: Campaign;
    const logger = (): void => {};

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.infos.journal = [];
        campaign.infos.highlightedJournal = {} as Campaign['infos']['highlightedJournal'];
    });

    it('should allow the dungeon master to set the highlighted journal post', async () => {
        const userId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
        campaign.campaignPlayers = [{ userId, characterIds: [], role: 'dungeon_master', status: 'active' }];
        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };
        const service = new UpdateCampaignJournalHighlightService({
            campaignsRepository: campaignsRepository as any,
            logger,
        });
        const post = {
            title: 'Pinned note',
            author: campaign.campaignPlayers[0],
            content: 'The ritual starts at dawn.',
            timestamp: new Date().toISOString(),
            category: 'master' as const,
        };

        const result = await service.updateHighlight({
            campaignId: campaign.campaignId as string,
            userId,
            toggle: 'on',
            post,
        });

        expect(result).to.be.deep.equal(post);
        expect(campaignsRepository.update).to.have.been.called();
    });

    it('should allow the admin player to set the highlighted journal post', async () => {
        const userId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
        campaign.campaignPlayers = [{ userId, characterIds: [], role: 'admin_player', status: 'active' }];
        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };
        const service = new UpdateCampaignJournalHighlightService({
            campaignsRepository: campaignsRepository as any,
            logger,
        });

        const result = await service.updateHighlight({
            campaignId: campaign.campaignId as string,
            userId,
            toggle: 'on',
            post: {
                title: 'Pinned note',
                author: campaign.campaignPlayers[0],
                content: 'The market is closed.',
                timestamp: new Date().toISOString(),
                category: 'announcements',
            },
        });

        expect(result).to.have.property('title', 'Pinned note');
    });

    it('should reject regular players', async () => {
        const userId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
        campaign.campaignPlayers = [{ userId, characterIds: [], role: 'player', status: 'active' }];
        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub(),
        };
        const service = new UpdateCampaignJournalHighlightService({
            campaignsRepository: campaignsRepository as any,
            logger,
        });

        let thrownError;

        try {
            await service.updateHighlight({
                campaignId: campaign.campaignId as string,
                userId,
                toggle: 'off',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
    });

    it('should clear the highlighted journal when toggle is off', async () => {
        const userId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
        campaign.campaignPlayers = [{ userId, characterIds: [], role: 'dungeon_master', status: 'active' }];
        campaign.infos.highlightedJournal = {
            title: 'Pinned note',
            author: campaign.campaignPlayers[0],
            content: 'Some content',
            timestamp: new Date().toISOString(),
            category: 'master',
        };
        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };
        const service = new UpdateCampaignJournalHighlightService({
            campaignsRepository: campaignsRepository as any,
            logger,
        });

        const result = await service.updateHighlight({
            campaignId: campaign.campaignId as string,
            userId,
            toggle: 'off',
        });

        expect(result).to.be.deep.equal({});
    });

    it('should ignore the provided post when toggle is off', async () => {
        const userId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
        campaign.campaignPlayers = [{ userId, characterIds: [], role: 'dungeon_master', status: 'active' }];
        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };
        const service = new UpdateCampaignJournalHighlightService({
            campaignsRepository: campaignsRepository as any,
            logger,
        });

        const result = await service.updateHighlight({
            campaignId: campaign.campaignId as string,
            userId,
            toggle: 'off',
            post: {
                title: 'Should be ignored',
                author: campaign.campaignPlayers[0],
                content: 'Ignored content',
                timestamp: new Date().toISOString(),
                category: 'master',
            },
        });

        expect(result).to.be.deep.equal({});
    });
});
