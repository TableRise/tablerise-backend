import sinon from 'sinon';
import DeleteCampaignOperation from 'src/core/campaigns/operations/DeleteCampaignOperation';

describe('Core :: Campaigns :: Operations :: DeleteCampaignOperation', () => {
    let deleteCampaignOperation: DeleteCampaignOperation, deleteCampaignService: any;

    const logger = (): void => {};

    context('#execute', () => {
        beforeEach(() => {
            deleteCampaignService = {
                deleteCampaign: sinon.stub().resolves(),
            };

            deleteCampaignOperation = new DeleteCampaignOperation({
                deleteCampaignService,
                logger,
            });
        });

        it('should call service with campaignId and userId', async () => {
            await deleteCampaignOperation.execute('campaign-id', 'user-id');

            expect(deleteCampaignService.deleteCampaign).to.have.been.calledWith('campaign-id', 'user-id');
        });
    });
});
