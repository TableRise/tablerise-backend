import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import UpdateTimestampRepository from 'src/infra/repositories/common/UpdateTimestampRepository';
import { Logger } from 'src/types/shared/logger';

describe('Infra :: Repositories :: User :: UpdateTimestampRepository', () => {
    let updateTimestampRepository: UpdateTimestampRepository, database: any;

    const logger: Logger = () => {};

    context('#updateTimestamp', () => {
        const findOne = sinon.spy(() => ({ userId: '123', email: 'test@email.com' }));
        const update = sinon.spy(() => ({ userId: '123', email: 'test@email.com' }));

        const findOneCampaign = sinon.spy(() => ({
            campaignId: '123',
            title: 'New camp',
        }));
        const updateCampaign = sinon.spy(() => ({
            campaignId: '123',
            title: 'New camp',
        }));

        beforeEach(() => {
            database = {
                modelInstance: sinon.spy((entity) => {
                    if (entity === 'user')
                        return {
                            findOne,
                            update,
                        };

                    if (entity === 'campaign')
                        return {
                            findOne: findOneCampaign,
                            update: updateCampaign,
                        };
                }),
            };

            updateTimestampRepository = new UpdateTimestampRepository({
                database,
                logger,
            });
        });

        it('should update timestamp - userId', async () => {
            await updateTimestampRepository.updateTimestamp({ userId: '123' });
            expect(findOne).to.have.been.called();
            expect(update).to.have.been.calledWith({ userId: '123' });
        });

        it('should update timestamp - userDetailId', async () => {
            await updateTimestampRepository.updateTimestamp({ userDetailId: '123' });
            expect(findOne).to.have.been.called();
            expect(update).to.have.been.calledWith({ userId: '123' });
        });

        it('should update timestamp - campaignId', async () => {
            await updateTimestampRepository.updateTimestamp({ campaignId: '123' });
            expect(findOneCampaign).to.have.been.called();
            expect(updateCampaign).to.have.been.calledWith({ campaignId: '123' });
        });

        it('should not update timestamp - missing query', async () => {
            try {
                await updateTimestampRepository.updateTimestamp({});
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal(
                    'Query not valid or missing to update user timestamp'
                );
                expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                expect(err.name).to.be.equal('BadRequest');
            }
        });
    });

    context('#updateTimestamp - Campaign', () => {
        const findOne = sinon.spy(() => ({ campaignId: '123' }));
        const update = sinon.spy(() => ({ campaignId: '123' }));

        beforeEach(() => {
            database = {
                modelInstance: sinon.spy(() => ({
                    findOne,
                    update,
                })),
            };

            updateTimestampRepository = new UpdateTimestampRepository({
                database,
                logger,
            });
        });

        it('should update timestamp - campaignId', async () => {
            await updateTimestampRepository.updateTimestamp({ campaignId: '123' });
            expect(findOne).to.have.been.called();
            expect(update).to.have.been.calledWith({ campaignId: '123' });
        });
    });
});
