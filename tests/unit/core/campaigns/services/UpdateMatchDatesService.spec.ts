import sinon from 'sinon';
import UpdateMatchDateService from 'src/core/campaigns/services/UpdateMatchDateService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Camapaigns :: Services :: UpdateMatchDateService', () => {
    let updateMatchDateService: UpdateMatchDateService,
        campaignsRepository: any,
        updateDatesPayload: any,
        campaignDatesLength: number,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#updateMatchDate', () => {
        context('When a date is added to match data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignDatesLength = campaign.infos.nextMatchDate.length;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                updateDatesPayload = {
                    campaignId: campaign.campaignId,
                    date: '20240403',
                    operation: 'add',
                };

                updateMatchDateService = new UpdateMatchDateService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated = await updateMatchDateService.updateMatchDate(
                    updateDatesPayload
                );
                expect(matchDataUpdated.infos.nextMatchDate.length).to.be.not.equal(
                    campaignDatesLength
                );
                expect(matchDataUpdated.infos.nextMatchDate.length).to.be.equal(
                    campaignDatesLength + 1
                );
            });
        });

        context('When a date is added to match data - date already exists', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaign.infos.nextMatchDate = '20240404';

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                updateDatesPayload = {
                    campaignId: campaign.campaignId,
                    date: '20240404',
                    operation: 'add',
                };

                updateMatchDateService = new UpdateMatchDateService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updateMatchDateService.updateMatchDate(updateDatesPayload);
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

                campaign.infos.nextMatchDate = '20240404';

                campaignDatesLength = campaign.infos.nextMatchDate.length;

                campaignsRepository = {
                    findOne: () => campaign,
                };

                updateDatesPayload = {
                    campaignId: campaign.campaignId,
                    date: '20240404',
                    operation: 'remove',
                };

                updateMatchDateService = new UpdateMatchDateService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated = await updateMatchDateService.updateMatchDate(
                    updateDatesPayload
                );
                expect(matchDataUpdated.infos.nextMatchDate.length).to.be.not.equal(
                    campaignDatesLength
                );
                expect(matchDataUpdated.infos.nextMatchDate.length).to.be.equal(
                    campaignDatesLength - 1
                );
            });
        });
    });

    context('#save', () => {
        context('When a campaign with new date is saved', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaign.infos.nextMatchDate = '20240404';

                campaignsRepository = {
                    update: sinon.spy(() => campaign),
                };

                updateMatchDateService = new UpdateMatchDateService({
                    campaignsRepository,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const saveCamapaignTest = await updateMatchDateService.save(campaign);

                expect(saveCamapaignTest).to.be.deep.equal(campaign);
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});
