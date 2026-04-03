import sinon from 'sinon';
import UpdateMatchDateOperation from 'src/core/campaigns/operations/UpdateMatchDateOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateMatchDateOperation', () => {
    let updateMatchDatesOperation: UpdateMatchDateOperation,
        updateMatchDateService: any,
        matchDatesPayload: any,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a campaign has the match dates', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                matchDatesPayload = {
                    campaignId: campaign.campaignId,
                    date: '2024-04-04',
                    operation: 'add',
                };

                campaign.infos.nextMatchDate = matchDatesPayload.date;

                updateMatchDateService = {
                    updateMatchDate: sinon.spy(),
                    save: sinon.spy(() => campaign),
                };

                updateMatchDatesOperation = new UpdateMatchDateOperation({
                    updateMatchDateService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const updateDateTest = await updateMatchDatesOperation.execute(matchDatesPayload);

                expect(updateMatchDateService.updateMatchDate).to.have.been.called();
                expect(updateMatchDateService.save).to.have.been.called();
                expect(updateDateTest).to.be.equal(campaign.infos.nextMatchDate);
            });
        });
    });

    context('When a match date update fails', () => {
        before(() => {
            matchDatesPayload = {
                campaignId: campaign.campaignId,
                date: '20240404',
                operation: 'add',
            };

            updateMatchDateService = {
                updateMatchDate: sinon.spy(() => { throw new Error('error throw') }),
                save: sinon.spy(() => campaign),
            };

            updateMatchDatesOperation = new UpdateMatchDateOperation({
                updateMatchDateService,
                logger,
            });
        });

        it('should throw the correct error', async () => {
            try {
                await updateMatchDatesOperation.execute(matchDatesPayload);
                expect('it should not be here').to.be.equal(false);
            } catch (error: any) {
                expect(error.message).to.be.equal('error throw');
            }
        });
    });
});
