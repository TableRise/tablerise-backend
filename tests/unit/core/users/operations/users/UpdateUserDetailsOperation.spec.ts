import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import UpdateUserDetailsOperation from 'src/core/users/operations/users/UpdateUserDetailsOperation';

describe('Core :: Users :: Operations :: UpdateUserDetailsOperation', () => {
    let updateUserDetailsOperation: UpdateUserDetailsOperation,
        updateUserDetailsService: any,
        userDetailsUpdated: UserDetail;

    const logger = (): void => {};

    context('When user details are updated with success', () => {
        before(() => {
            userDetailsUpdated = DomainDataFaker.generateUserDetailsJSON()[0];

            updateUserDetailsService = {
                update: sinon.spy(() => userDetailsUpdated),
            };

            updateUserDetailsOperation = new UpdateUserDetailsOperation({
                updateUserDetailsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const userDetailsTest = await updateUserDetailsOperation.execute({
                userId: '123',
                payload: DomainDataFaker.mocks.updateUserDetailsMock,
            });

            expect(updateUserDetailsService.update).to.have.been.calledWith({
                userId: '123',
                payload: DomainDataFaker.mocks.updateUserDetailsMock,
            });
            expect(userDetailsTest).to.be.deep.equal(userDetailsUpdated);
        });
    });

    context('When user details update fails', () => {
        before(() => {
            updateUserDetailsService = {
                update: sinon.spy(() => {
                    throw new Error('error throw');
                }),
            };

            updateUserDetailsOperation = new UpdateUserDetailsOperation({
                updateUserDetailsService,
                logger,
            });
        });

        it('should throw the correct error', async () => {
            try {
                await updateUserDetailsOperation.execute({
                    userId: '123',
                    payload: DomainDataFaker.mocks.updateUserDetailsMock,
                });
                expect('it should not be here').to.be.equal(false);
            } catch (error: any) {
                expect(error.message).to.be.equal('error throw');
            }
        });
    });
});
