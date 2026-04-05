import sinon from 'sinon';
import UpdatePasswordOperation from 'src/core/users/operations/users/UpdatePasswordOperation';

describe('Core :: Users :: Operations :: UpdatePasswordOperation', () => {
    let updatePasswordOperation: UpdatePasswordOperation,
        updatePasswordService: any,
        payload: any;

    const logger = (): void => {};

    context('When get users with success', () => {
        before(() => {
            updatePasswordService = {
                update: sinon.spy(() => ({})),
            };

            payload = {
                email: 'user@email.com',
                code: '123456',
                password: 'World#123',
            };

            updatePasswordOperation = new UpdatePasswordOperation({
                updatePasswordService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            await updatePasswordOperation.execute(payload);

            expect(updatePasswordService.update).to.have.been.called();
        });
    });
});
