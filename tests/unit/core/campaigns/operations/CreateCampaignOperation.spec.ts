import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import sinon from 'sinon';
import CreateCampaignOperation from 'src/core/campaigns/operations/campaigns/CreateCampaignOperation';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Campaigns :: Operations :: CreateCampaignOperation', () => {
    let createCampaignOperation: CreateCampaignOperation,
        campaignsSchema: any,
        schemaValidator: any,
        createCampaignService: any,
        campaignToCreate: any,
        campaignCreated: any,
        userId: any;

    const logger = (): void => {};

    context('When a new campaign is created with success', () => {
        before(() => {
            campaignsSchema = {
                campaignZod: {},
            };

            userId = newUUID();

            schemaValidator = { entry: sinon.spy(() => {}) };

            campaignCreated = DomainDataFaker.generateCampaignsJSON()[0];

            createCampaignService = {
                serialize: sinon.spy(() => ({
                    campaignSerialized: {},
                })),
                enrichment: sinon.spy(() => ({
                    campaignEnriched: {},
                })),
                save: sinon.spy(() => campaignCreated),
            };

            createCampaignOperation = new CreateCampaignOperation({
                campaignsSchema,
                schemaValidator,
                createCampaignService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const campaignTest = await createCampaignOperation.execute({
                campaign: campaignToCreate,
                userId,
            });

            expect(schemaValidator.entry).to.have.been.called(2);
            expect(createCampaignService.serialize).to.have.been.called();
            expect(createCampaignService.enrichment).to.have.been.calledWith(
                {
                    campaignSerialized: {},
                },
                userId
            );
            expect(createCampaignService.save).to.have.been.calledWith({
                campaignEnriched: {},
            });
            expect(campaignTest).to.be.deep.equal(campaignCreated);
        });
    });

    context('When a new campaign creation fails', () => {
        before(() => {
            campaignsSchema = {
                campaignZod: {},
            };

            userId = newUUID();

            schemaValidator = { entry: sinon.stub() };

            schemaValidator.entry.onCall(0).callsFake(() => {
                throw new HttpRequestErrors({
                    message: 'Schema error',
                    name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                    code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                    details: [
                        {
                            attribute: 'ageRestriction',
                            path: 'payload',
                            reason: 'Required',
                        },
                    ],
                });
            });

            campaignCreated = DomainDataFaker.generateCampaignsJSON()[0];

            createCampaignService = {
                serialize: sinon.spy(() => ({
                    campaignSerialized: {},
                })),
                enrichment: sinon.spy(() => ({
                    campaignEnriched: {},
                })),
                save: sinon.spy(() => campaignCreated),
            };

            createCampaignOperation = new CreateCampaignOperation({
                campaignsSchema,
                schemaValidator,
                createCampaignService,
                logger,
            });
        });

        it('should throw the correct error', async () => {
            try {
                await createCampaignOperation.execute({
                    campaign: campaignCreated,
                    userId,
                });
                expect('it should not be here').to.be.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Schema error');
                expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(err.name).to.be.equal('UnprocessableEntity');
                expect(err.details[0].attribute).to.be.equal('ageRestriction');
                expect(err.details[0].reason).to.be.equal('Required');
            }
        });
    });
});
