import sinon from 'sinon';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import PostCampaignLogService from 'src/core/campaigns/services/PostCampaignLogService';

describe('Core :: Campaigns :: Services :: PostCampaignLogService', () => {
    let postCampaignLogService: PostCampaignLogService;
    let campaignsRepository: any;
    let campaign: Campaign;

    const logger = (): void => {};

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.matchData.logs = [{ loggedAt: '2026-01-01T00:00:00.000Z', content: 'Existing log' }];

        campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            updateMatchLogs: sinon
                .stub()
                .callsFake(async (_campaignId: string, logs: Campaign['matchData']['logs']) => ({
                    ...campaign,
                    matchData: {
                        ...campaign.matchData,
                        logs,
                    },
                })),
        };

        postCampaignLogService = new PostCampaignLogService({
            campaignsRepository,
            logger,
        } as any);
    });

    it('should append a new log and persist through updateMatchLogs', async () => {
        const payload = {
            campaignId: campaign.campaignId as string,
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            payload: {
                loggedAt: '2026-05-13T12:00:00.000Z',
                content: 'New log entry',
            },
        };

        const result = await postCampaignLogService.createLog(payload);

        expect(campaignsRepository.findOne).to.have.been.calledWith({ campaignId: campaign.campaignId });
        expect(campaignsRepository.updateMatchLogs).to.have.been.calledWith(campaign.campaignId, [
            { loggedAt: '2026-01-01T00:00:00.000Z', content: 'Existing log' },
            payload.payload,
        ]);
        expect(result.matchData.logs).to.have.lengthOf(2);
        expect(result.matchData.logs[1]).to.deep.equal(payload.payload);
    });

    it('should throw when caller is not in campaign players', async () => {
        try {
            await postCampaignLogService.createLog({
                campaignId: campaign.campaignId as string,
                userId: 'missing-user',
                payload: {
                    loggedAt: '2026-05-13T12:00:00.000Z',
                    content: 'Forbidden log',
                },
            });

            expect.fail('Expected createLog to throw');
        } catch (error) {
            const err = error as HttpRequestErrors;

            expect(err.message).to.equal('This player is not in the campaign');
            expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
        }
    });
});
