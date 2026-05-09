import sinon from 'sinon';
import UpdateCampaignPlayerLimitOperation from 'src/core/campaigns/operations/UpdateCampaignPlayerLimitOperation';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateCampaignPlayerLimitOperation', () => {
    let updateCampaignPlayerLimitOperation: UpdateCampaignPlayerLimitOperation, updateCampaignPlayerLimitService: any;

    const logger = (): void => {};
    const socketIO = { emitToCampaign: sinon.spy(), syncActiveCampaign: sinon.spy() } as any;

    context('#execute', () => {
        context('When campaign player limit is updated', () => {
            before(() => {
                updateCampaignPlayerLimitService = {
                    updatePlayerLimit: sinon.spy(() => {
                        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
                        campaign.infos.playerAmountLimit = 5;
                        return campaign;
                    }),
                };

                updateCampaignPlayerLimitOperation = new UpdateCampaignPlayerLimitOperation({
                    updateCampaignPlayerLimitService,
                    socketIO,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const campaignId = 'campaign-id-123';
                const newLimit = 5;

                await updateCampaignPlayerLimitOperation.execute(campaignId, newLimit);

                expect(updateCampaignPlayerLimitService.updatePlayerLimit).to.have.been.calledWith(
                    campaignId,
                    newLimit
                );
            });
        });
    });
});
