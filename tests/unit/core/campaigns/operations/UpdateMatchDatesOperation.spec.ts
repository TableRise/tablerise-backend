import sinon from 'sinon';
import UpdateMatchDateOperation from 'src/core/campaigns/operations/UpdateMatchDateOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateMatchDateOperation', () => {
    let updateMatchDatesOperation: UpdateMatchDateOperation,
        campaignsSchema: any,
        schemaValidator: any,
        updateMatchDateService: any,
        matchDatesPayload: any,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a campaign has the match dates', () => {
            before(() => {
                campaignsSchema = {
                    campaignsUpdateMatchDatesZod: {},
                };

                schemaValidator = { entry: sinon.spy(() => {}) };

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
                    campaignsSchema,
                    schemaValidator,
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
            campaignsSchema = {
                campaignsUpdateMatchDatesZod: {},
            };

            schemaValidator = { entry: sinon.stub() };

            schemaValidator.entry.onCall(0).callsFake(() => {
                throw new HttpRequestErrors({
                    message: 'Schema error',
                    name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                    code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                    details: [
                        {
                            attribute: 'date',
                            path: 'payload',
                            reason: 'Invalid',
                        },
                    ],
                });
            });

            matchDatesPayload = {
                campaignId: campaign.campaignId,
                date: '20240404',
                operation: 'add',
            };

            updateMatchDatesOperation = new UpdateMatchDateOperation({
                updateMatchDateService,
                campaignsSchema,
                schemaValidator,
                logger,
            });
        });

        it('should throw the correct error', async () => {
            try {
                await updateMatchDatesOperation.execute(matchDatesPayload);
                expect('it should not be here').to.be.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Schema error');
                expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(err.name).to.be.equal('UnprocessableEntity');
                expect(err.details[0].attribute).to.be.equal('date');
                expect(err.details[0].reason).to.be.equal('Invalid');
            }
        });
    });
});
