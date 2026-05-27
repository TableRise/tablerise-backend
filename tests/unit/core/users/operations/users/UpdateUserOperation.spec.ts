import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import UpdateUserOperation from 'src/core/users/operations/users/UpdateUserOperation';

describe('Core :: Users :: Operations :: UpdateUserOperation', () => {
    let updateUserOperation: UpdateUserOperation, updateUserService: any, userUpdated: any;

    const logger = (): void => {};

    context('When a new user is updated with success', () => {
        before(() => {
            userUpdated = DomainDataFaker.generateUsersJSON()[0];

            updateUserService = {
                update: sinon.spy(() => userUpdated),
            };

            updateUserOperation = new UpdateUserOperation({
                updateUserService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const userTest = await updateUserOperation.execute({
                userId: '123',
                payload: userUpdated,
            });

            expect(updateUserService.update).to.have.been.calledWith({
                userId: '123',
                payload: userUpdated,
            });
            expect(userTest).to.be.deep.equal(userUpdated);
        });
    });

    context('When a new user update fails', () => {
        before(() => {
            userUpdated = DomainDataFaker.generateUsersJSON()[0];

            updateUserService = {
                update: sinon.spy(() => {
                    throw new Error('error throw');
                }),
            };

            updateUserOperation = new UpdateUserOperation({
                updateUserService,
                logger,
            });
        });

        it('should throw the correct error', async () => {
            try {
                await updateUserOperation.execute({
                    userId: '123',
                    payload: userUpdated,
                });
                expect('it should not be here').to.be.equal(false);
            } catch (error: any) {
                expect(error.message).to.be.equal('error throw');
            }
        });
    });
});
