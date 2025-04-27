import sinon from 'sinon';
import GetCampaignsByUserIdOperation from 'src/core/campaigns/operations/GetCampaignsByUserIdOperation';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Campaigns :: Operations :: GetCampaignsByUserIdOperation', () => {
    let getCampaignsByUserIdOperation: GetCampaignsByUserIdOperation,
        getCampaignsByUserIdService: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a campaigns are successfully recovered by userId', () => {
            const userId = newUUID();

            before(() => {
                getCampaignsByUserIdService = {
                    getByUserId: sinon.spy(),
                };

                getCampaignsByUserIdOperation = new GetCampaignsByUserIdOperation({
                    getCampaignsByUserIdService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await getCampaignsByUserIdOperation.execute(userId);
                expect(getCampaignsByUserIdService.getByUserId).to.have.been.called();
            });
        });
    });
});
