import sinon from 'sinon';
import GetCampaignByIdService from 'src/core/campaigns/services/campaigns/GetCampaignByIdService';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Campaigns :: Services :: GetCampaignByIdService', () => {
    let getCampaignByIdService: GetCampaignByIdService, campaignsRepository: any;

    const logger = (): void => {};

    context('#get', () => {
        context('When a campaign is recovered by id', () => {
            const campaignId = newUUID();

            before(() => {
                campaignsRepository = {
                    findOne: sinon.spy(),
                };

                getCampaignByIdService = new GetCampaignByIdService({
                    campaignsRepository,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await getCampaignByIdService.get({ campaignId });
                expect(campaignsRepository.findOne).to.have.been.called();
            });
        });
    });
});
