import sinon from 'sinon';
import GetAllCampaignsService from 'src/core/campaigns/services/GetAllCampaignsService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Campaigns :: Services :: GetAllCampaignsService', () => {
    let getAllCampaignsService: GetAllCampaignsService, campaignsRepository: any, campaigns: any;

    const logger = (): void => {};

    context('#get', () => {
        context('When all campaigns are successfully recovered', () => {

            before(() => {
                const id = newUUID();
                campaigns = DomainDataFaker.generateCampaignsJSON({count: 3, campaignId: id})

                campaignsRepository = {
                    find: sinon.spy(() => campaigns),
                };

                getAllCampaignsService = new GetAllCampaignsService({
                    campaignsRepository,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const campaignsTest = await getAllCampaignsService.getAll();
                expect(campaignsRepository.find).to.have.been.called();
                expect(campaignsTest).to.be.deep.equal(campaigns);
            });
        });
    });
});