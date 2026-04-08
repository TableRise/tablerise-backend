import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import UpdateUserOperation from 'src/core/users/operations/users/UpdateUserOperation';

describe('Core :: Users :: Operations :: UpdateUserOperation', () => {
    let updateUserOperation: UpdateUserOperation,
        usersSchema: any,
        schemaValidator: any,
        updateUserService: any,
        userWithouDetails: any,
        userUpdated: any;

    const logger = (): void => {};

    context('When a new user is updated with success', () => {
        before(() => {
            userWithouDetails = DomainDataFaker.generateUsersJSON()[0];

            userUpdated = {
                ...userWithouDetails,
                details: DomainDataFaker.generateUserDetailsJSON()[0],
            };

            updateUserService = {
                update: sinon.spy(() => ({
                    user: {},
                    userDetails: {},
                })),
                save: sinon.spy(() => userUpdated),
                _validateUpdateData: sinon.spy(() => {}),
            };

            updateUserOperation = new UpdateUserOperation({
                usersSchema,
                schemaValidator,
                updateUserService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const userTest = await updateUserOperation.execute({
                userId: '123',
                payload: userUpdated,
            });

            expect(updateUserService.save).to.have.been.called();
            expect(updateUserService.update).to.have.been.calledWith({
                userId: '123',
                payload: userUpdated,
            });
            expect(updateUserService.save).to.have.been.calledWith({
                user: {},
                userDetails: {},
            });
            expect(userTest).to.be.deep.equal(userUpdated);
        });
    });

    context('When a new user update fails', () => {
        before(() => {
            userWithouDetails = DomainDataFaker.generateUsersJSON()[0];

            userUpdated = {
                ...userWithouDetails,
                details: DomainDataFaker.generateUserDetailsJSON()[0],
            };

            updateUserService = {
                update: sinon.spy(() => {
                    throw new Error('error throw');
                }),
                save: sinon.spy(() => userUpdated),
                _validateUpdateData: sinon.spy(() => {}),
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
