import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Infra :: Repositories :: Campaign :: CampaignsRepository', () => {
    let campaignsRepository: CampaignsRepository,
        updateTimestampRepository: any,
        database: any,
        serializer: any,
        campaign: any,
        query: any,
        createdCampaign: any,
        campaignToCreate: any,
        campaignToUpdate: any;

    const logger = (): void => {};

    context('#create', () => {
        createdCampaign = DomainDataFaker.mocks.campaignMock;
        const create = sinon.spy(() => createdCampaign);

        beforeEach(() => {
            campaignToCreate = DomainDataFaker.mocks.createCampaignMock;

            database = {
                modelInstance: () => ({
                    create,
                }),
            };

            serializer = {
                postCampaign: (obj: any) => obj,
            };

            updateTimestampRepository = {};

            campaignsRepository = new CampaignsRepository({
                database,
                updateTimestampRepository,
                serializer,
                logger,
            });
        });

        it('should create an campaign and return serialized', async () => {
            const result = await campaignsRepository.create(campaignToCreate);

            expect(create).to.have.been.called();
            expect(result).to.have.property('title');
            expect(result.title).to.be.equal(campaignToCreate.title);
        });
    });

    context('#findOne', () => {
        context('When a campaign is recovered from database', () => {
            const campaignId = newUUID();

            before(() => {
                campaign = {
                    campaignId,
                };

                database = {
                    modelInstance: () => ({ findOne: () => campaign }),
                };

                serializer = {
                    postCampaign: (payload: any) => payload,
                };

                query = {
                    campaignId,
                };

                updateTimestampRepository = {};

                campaignsRepository = new CampaignsRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                const campaignTest = await campaignsRepository.findOne(query);
                expect(campaignTest).to.be.deep.equal(campaign);
            });
        });

        context('When a campaign is not recovered from database', () => {
            const campaignId = newUUID();

            before(() => {
                campaign = {
                    campaignId,
                };

                database = {
                    modelInstance: () => ({ findOne: () => null }),
                };

                serializer = {
                    postCampaign: (payload: any) => payload,
                };

                updateTimestampRepository = {};

                campaignsRepository = new CampaignsRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                try {
                    await campaignsRepository.findOne();
                    expect.fail('it should bot be here');
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Campaign does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });
    });

    context('#update', () => {
        context('When a campaign is updated in database', () => {
            const campaignId = newUUID();

            before(() => {
                campaign = {
                    campaignId,
                };

                database = {
                    modelInstance: () => ({ update: () => campaign }),
                };

                serializer = {
                    postCampaign: (payload: any) => payload,
                };

                query = {
                    campaignId,
                };

                campaignToUpdate = { ...campaign, description: '123' };

                updateTimestampRepository = { updateTimestamp: () => {} };

                campaignsRepository = new CampaignsRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                const campaignTest = await campaignsRepository.update({
                    query,
                    payload: campaignToUpdate,
                });
                expect(campaignTest).to.be.deep.equal(campaign);
            });
        });

        context('When a campaign for update is not recovered from database', () => {
            const campaignId = newUUID();

            before(() => {
                campaign = {
                    campaignId,
                };

                database = {
                    modelInstance: () => ({ update: () => null }),
                };

                serializer = {
                    postCampaign: (payload: any) => payload,
                };

                updateTimestampRepository = {};

                campaignsRepository = new CampaignsRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                try {
                    await campaignsRepository.update({ query, payload: null });
                    expect.fail('it should bot be here');
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Campaign does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });
    });
});
