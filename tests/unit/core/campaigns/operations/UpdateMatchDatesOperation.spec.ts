import sinon from 'sinon';
import UpdateMatchDatesOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchDatesOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateMatchDatesOperation', () => {
    let updateMatchDatesOperation: UpdateMatchDatesOperation,
        updateMatchDatesService: any,
        matchDatesPayload: any,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a campaign has the match dates', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                matchDatesPayload = {
                    campaignId: campaign.campaignId,
                    date: '20240404',
                    operation: 'add',
                };

                campaign.infos.matchDates = [matchDatesPayload.date];

                updateMatchDatesService = {
                    updateMatchDates: sinon.spy(),
                    save: sinon.spy(() => campaign),
                };

                updateMatchDatesOperation = new UpdateMatchDatesOperation({
                    updateMatchDatesService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const updateDateTest = await updateMatchDatesOperation.execute(
                    matchDatesPayload
                );

                expect(updateMatchDatesService.updateMatchDates).to.have.been.called();
                expect(updateMatchDatesService.save).to.have.been.called();
                expect(updateDateTest[0]).to.be.equal(campaign.infos.matchDates[0]);
            });
        });
    });
});
