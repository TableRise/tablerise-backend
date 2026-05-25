import sinon from 'sinon';
import DeleteCampaignOperation from 'src/core/campaigns/operations/DeleteCampaignOperation';

describe('Core :: Campaigns :: Operations :: DeleteCampaignOperation', () => {
    let deleteCampaignOperation: DeleteCampaignOperation, deleteCampaignService: any;

    const logger = (): void => {};

    context('#execute', () => {
        beforeEach(() => {
            deleteCampaignService = {
                deleteCampaign: sinon.stub().resolves({ campaignId: 'campaign-id', status: 'closed' }),
            };

            deleteCampaignOperation = new DeleteCampaignOperation({
                deleteCampaignService,
                logger,
            });
        });

        it('should call service with campaignId and userId', async () => {
            const result = await deleteCampaignOperation.execute('campaign-id', 'user-id');

            expect(deleteCampaignService.deleteCampaign).to.have.been.calledWith('campaign-id', 'user-id');
            expect(result.status).to.equal('closed');
        });
    });
});
