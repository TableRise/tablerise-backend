import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { any } from 'zod';

describe('Infra :: Repositories :: Campaign :: CampaignsRepository', () => {
    let campaignsRepository: CampaignsRepository,
        database: any,
        serializer: any,
        campaign: any,
        query: any,
        createdCampaign: any,
        campaignToCreate: any,
        campaigns: any;

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

            campaignsRepository = new CampaignsRepository({
                database,
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

                campaignsRepository = new CampaignsRepository({
                    database,
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

                campaignsRepository = new CampaignsRepository({
                    database,
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

    context('#find', () => {
        const findAll = sinon.spy(() => campaigns);

        beforeEach(() => {
            campaigns = DomainDataFaker.generateCampaignsJSON({ count: 1 });

            database = {
                modelInstance: () => ({ findAll }),
            };

            serializer = {
                postCampaign: (obj: any) => obj,
            };

            campaignsRepository = new CampaignsRepository({
                database,
                serializer,
                logger,
            });
        });

        it('should return all campaigns in database', async () => {
            const campaignsTest = await campaignsRepository.find();
            expect(findAll).to.have.been.called();
            expect(campaignsTest).to.be.deep.equal(campaigns);
        });
    });
});
