import sinon from 'sinon';
import GetCampaignByIdOperation from 'src/core/campaigns/operations/campaigns/GetCampaignByIdOperation';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Campaigns :: Operations :: GetCampaignByIdOperation', () => {
    let getCampaignByIdOperation: GetCampaignByIdOperation, getCampaignByIdService: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a campaign is successfully recovered', () => {
            const campaignId = newUUID();

            before(() => {
                getCampaignByIdService = {
                    get: sinon.spy(),
                };

                getCampaignByIdOperation = new GetCampaignByIdOperation({
                    getCampaignByIdService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await getCampaignByIdOperation.execute({ campaignId });
                expect(getCampaignByIdService.get).to.have.been.called();
            });
        });
    });
});
