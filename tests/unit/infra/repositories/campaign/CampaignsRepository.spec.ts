import sinon from 'sinon';
// import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

describe('Infra :: Repositories :: Campaign :: CampaignsRepository', () => {
    let campaignsRepository: CampaignsRepository,
        createdCampaign: any,
        campaignToCreate: any,
        database: any,
        campaignsSerializer: any;

    const logger: Logger = () => {};

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

            campaignsSerializer = {
                postCampaign: (obj: any) => obj,
            };

            campaignsRepository = new CampaignsRepository({
                database,
                campaignsSerializer,
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
        context('when is found', () => {
            createdCampaign = DomainDataFaker.mocks.campaignMock;
            const findOne = sinon.spy(() => createdCampaign);

            beforeEach(() => {
                database = {
                    modelInstance: sinon.spy(() => ({
                        findOne,
                    })),
                };

                campaignsSerializer = {
                    postCampaign: (obj: any) => obj,
                };

                campaignsRepository = new CampaignsRepository({
                    database,
                    campaignsSerializer,
                    logger,
                });
            });

            it('should find an campaign and return serialized', async () => {
                const result = await campaignsRepository.findOne({
                    campaignId: createdCampaign.campaignId,
                });

                expect(findOne).to.have.been.called();
                expect(result).to.have.property('title');
                expect(result.title).to.be.equal(createdCampaign.title);
            });

            it('should find an campaign and return serialized - query undefined', async () => {
                const result = await campaignsRepository.findOne();

                expect(findOne).to.have.been.called();
                expect(result).to.have.property('title');
                expect(result.title).to.be.equal(createdCampaign.title);
            });
        });

        context('when is not found', () => {
            beforeEach(() => {
                database = {
                    modelInstance: () => ({
                        findOne: () => null,
                    }),
                };

                campaignsSerializer = {
                    postCampaign: (obj: any) => obj,
                };

                campaignsRepository = new CampaignsRepository({
                    database,
                    campaignsSerializer,
                    logger,
                });
            });

            it('should find an campaign and return serialized', async () => {
                try {
                    await campaignsRepository.findOne({
                        campaignId: '',
                    });
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
