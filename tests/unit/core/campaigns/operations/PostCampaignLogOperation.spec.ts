import sinon from 'sinon';
import PostCampaignLogOperation from 'src/core/campaigns/operations/PostCampaignLogOperation';

describe('Core :: Campaigns :: Operations :: PostCampaignLogOperation', () => {
    it('should sync and emit the created match log', async () => {
        const savedCampaign = {
            campaignId: 'campaign-id',
            matchData: {
                logs: [
                    { loggedAt: '2026-05-13T12:00:00.000Z', content: 'Existing log' },
                    { loggedAt: '2026-05-13T12:30:00.000Z', content: 'Created log' },
                ],
            },
        };
        const postCampaignLogService = {
            createLog: sinon.stub().resolves(savedCampaign),
        };
        const socketIO = { syncActiveCampaign: sinon.stub(), emitToCampaign: sinon.stub() };
        const operation = new PostCampaignLogOperation({
            postCampaignLogService: postCampaignLogService as any,
            socketIO: socketIO as any,
            logger: (): void => {},
        });
        const payload = {
            campaignId: 'campaign-id',
            userId: 'user-id',
            payload: {
                loggedAt: '2026-05-13T12:30:00.000Z',
                content: 'Created log',
            },
        };

        const result = await operation.execute(payload);

        expect(postCampaignLogService.createLog).to.have.been.calledWith(payload);
        expect(socketIO.syncActiveCampaign).to.have.been.calledWith(savedCampaign);
        expect(socketIO.emitToCampaign).to.have.been.calledWith('campaign-id', 'match:log_created', {
            campaignId: 'campaign-id',
            log: { loggedAt: '2026-05-13T12:30:00.000Z', content: 'Created log' },
        });
        expect(result).to.deep.equal(savedCampaign);
    });
});
