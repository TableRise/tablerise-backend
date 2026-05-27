import sinon from 'sinon';
import GetCampaignByIdService from 'src/core/campaigns/services/GetCampaignByIdService';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Core :: Campaigns :: Services :: GetCampaignByIdService', () => {
    let getCampaignByIdService: GetCampaignByIdService, campaignsRepository: any;

    const logger = (): void => {};

    context('#get', () => {
        context('When a campaign is recovered by id', () => {
            const campaignId = newUUID();

            before(() => {
                const campaign = DomainDataFaker.generateCampaignsJSON()[0];
                campaign.campaignId = campaignId;
                campaignsRepository = {
                    findOne: sinon.spy(() => campaign),
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

        context('When the campaign no longer exists', () => {
            before(() => {
                campaignsRepository = {
                    findOne: sinon.spy(() => null),
                };

                getCampaignByIdService = new GetCampaignByIdService({
                    campaignsRepository,
                    logger,
                });
            });

            it('should throw a not found error', async () => {
                try {
                    await getCampaignByIdService.get({ campaignId: 'missing-campaign' });
                    expect.fail('Expected missing campaign error');
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.equal('Campaign does not exist');
                    expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                }
            });
        });
    });
});
