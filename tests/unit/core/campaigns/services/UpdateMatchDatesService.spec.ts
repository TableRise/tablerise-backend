import sinon from 'sinon';
import UpdateMatchDatesService from 'src/core/campaigns/services/UpdateMatchDatesService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Camapaigns :: Services :: UpdateMatchDatesService', () => {
    let updateMatchDatesService: UpdateMatchDatesService,
        campaignsRepository: any,
        updateDatesPayload: any,
        campaignDatesLength: number,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#updateMatchDates', () => {
        context('When a date is added to match data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignDatesLength = campaign.infos.matchDates.length;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                updateDatesPayload = {
                    campaignId: campaign.campaignId,
                    date: '20240403',
                    operation: 'add',
                };

                updateMatchDatesService = new UpdateMatchDatesService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated = await updateMatchDatesService.updateMatchDates(
                    updateDatesPayload
                );
                expect(matchDataUpdated.infos.matchDates.length).to.be.not.equal(
                    campaignDatesLength
                );
                expect(matchDataUpdated.infos.matchDates.length).to.be.equal(
                    campaignDatesLength + 1
                );
            });
        });

        context('When a date is added to match data - date already exists', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaign.infos.matchDates = ['20240404'];

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                updateDatesPayload = {
                    campaignId: campaign.campaignId,
                    date: '20240404',
                    operation: 'add',
                };

                updateMatchDatesService = new UpdateMatchDatesService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updateMatchDatesService.updateMatchDates(updateDatesPayload);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Date already added');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.BAD_REQUEST)
                    );
                }
            });
        });

        context('When a date is removed from match data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaign.infos.matchDates = ['20240404'];

                campaignDatesLength = campaign.infos.matchDates.length;

                campaignsRepository = {
                    findOne: () => campaign,
                };

                updateDatesPayload = {
                    campaignId: campaign.campaignId,
                    date: '20240404',
                    operation: 'remove',
                };

                updateMatchDatesService = new UpdateMatchDatesService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated = await updateMatchDatesService.updateMatchDates(
                    updateDatesPayload
                );
                expect(matchDataUpdated.infos.matchDates.length).to.be.not.equal(
                    campaignDatesLength
                );
                expect(matchDataUpdated.infos.matchDates.length).to.be.equal(
                    campaignDatesLength - 1
                );
            });
        });
    });

    context('#save', () => {
        context('When a campaign with new date is saved', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaign.infos.matchDates = ['20240404'];

                campaignsRepository = {
                    update: sinon.spy(() => campaign),
                };

                updateMatchDatesService = new UpdateMatchDatesService({
                    campaignsRepository,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const saveCamapaignTest = await updateMatchDatesService.save(campaign);

                expect(saveCamapaignTest).to.be.deep.equal(campaign);
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});
