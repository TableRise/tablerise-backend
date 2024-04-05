import sinon from 'sinon';
import GetAllCampaignsOperation from 'src/core/campaigns/operations/GetAllCampaignsOperation';

describe('Core :: Campaigns :: Operations :: GetAllCampaignsOperation', () => {
    let getAllCampaignsOperation: GetAllCampaignsOperation, getAllCampaignsService: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When all campaigns are successfully recovered', () => {

            before(() => {
                getAllCampaignsService = {
                    getAll: sinon.spy(),
                };

                getAllCampaignsOperation = new GetAllCampaignsOperation({
                    getAllCampaignsService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await getAllCampaignsOperation.execute();
                expect(getAllCampaignsService.getAll).to.have.been.called();
            });
        });
    });
});