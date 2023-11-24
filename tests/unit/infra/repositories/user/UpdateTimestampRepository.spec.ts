import sinon from 'sinon';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import UpdateTimestampRepository from 'src/infra/repositories/user/UpdateTimestampRepository';
import { Logger } from 'src/types/Logger';

describe('Infra :: Repositories :: User :: UpdateTimestampRepository', () => {
    let updateTimestampRepository: UpdateTimestampRepository, database: any;

    const logger: Logger = () => {};

    context('#updateTimestamp', () => {
        const findOne = sinon.spy(() => ({ userId: '123', email: 'test@email.com' }));
        const update = sinon.spy(() => ({ userId: '123', email: 'test@email.com' }));

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
});
