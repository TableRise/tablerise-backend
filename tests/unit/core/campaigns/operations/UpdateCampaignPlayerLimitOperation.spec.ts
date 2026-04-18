import sinon from 'sinon';
import UpdateCampaignPlayerLimitOperation from 'src/core/campaigns/operations/UpdateCampaignPlayerLimitOperation';

describe('Core :: Campaigns :: Operations :: UpdateCampaignPlayerLimitOperation', () => {
    let updateCampaignPlayerLimitOperation: UpdateCampaignPlayerLimitOperation,
        updateCampaignPlayerLimitService: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When campaign player limit is updated', () => {
            before(() => {
                updateCampaignPlayerLimitService = {
                    updatePlayerLimit: sinon.spy(),
                };

                updateCampaignPlayerLimitOperation = new UpdateCampaignPlayerLimitOperation({
                    updateCampaignPlayerLimitService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const campaignId = 'campaign-id-123';
                const newLimit = 5;

                await updateCampaignPlayerLimitOperation.execute(campaignId, newLimit);

                expect(updateCampaignPlayerLimitService.updatePlayerLimit).to.have.been.calledWith(campaignId, newLimit);
            });
        });
    });
});
