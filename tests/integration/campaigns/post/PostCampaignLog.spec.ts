import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a campaign match log is created', () => {
    const authenticatedUserId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    let campaign: Campaign;
    const buildHighlightedJournal = (player: Campaign['campaignPlayers'][number]) => ({
        title: 'Pinned note',
        author: player,
        content: 'The town is waiting.',
        timestamp: new Date().toISOString(),
        category: 'players' as const,
    });

    beforeEach(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.matchData.logs = [];
        campaign.infos.highlightedJournal = buildHighlightedJournal(campaign.campaignPlayers[0]) as any;

        await InjectNewCampaign(campaign);
    });

    it('should append one new log to the campaign match logs', async () => {
        const payload = {
            loggedAt: '2026-05-13T12:00:00.000Z',
            content: 'First log entry',
        };

        const { body } = await requester()
            .post(`/campaigns/${campaign.campaignId as string}/logs`)
            .send(payload)
            .expect(HttpStatusCode.CREATED);

        expect(body.matchData.logs).to.have.lengthOf(1);
        expect(body.matchData.logs[0]).to.deep.equal(payload);
    });

    it('should preserve existing logs and append the new one at the end', async () => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.matchData.logs = [{ loggedAt: '2026-05-13T11:00:00.000Z', content: 'Existing log' }];
        campaign.infos.highlightedJournal = buildHighlightedJournal(campaign.campaignPlayers[0]) as any;

        await InjectNewCampaign(campaign);

        const payload = {
            loggedAt: '2026-05-13T12:00:00.000Z',
            content: 'Appended log',
        };

        const { body } = await requester()
            .post(`/campaigns/${campaign.campaignId as string}/logs`)
            .send(payload)
            .expect(HttpStatusCode.CREATED);

        expect(body.matchData.logs).to.have.lengthOf(2);
        expect(body.matchData.logs[0]).to.deep.equal({
            loggedAt: '2026-05-13T11:00:00.000Z',
            content: 'Existing log',
        });
        expect(body.matchData.logs[1]).to.deep.equal(payload);
    });

    it('should return campaign-player-not-exists when caller is outside the campaign', async () => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: '00000000-0000-0000-0000-000000000001',
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.matchData.logs = [];
        campaign.infos.highlightedJournal = buildHighlightedJournal(campaign.campaignPlayers[0]) as any;

        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .post(`/campaigns/${campaign.campaignId as string}/logs`)
            .send({
                loggedAt: '2026-05-13T12:00:00.000Z',
                content: 'Forbidden log',
            })
            .expect(HttpStatusCode.NOT_FOUND);

        expect(body.message).to.equal('This player is not in the campaign');
    });
});
