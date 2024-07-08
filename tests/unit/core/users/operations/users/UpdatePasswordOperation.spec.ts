import sinon from 'sinon';
import UpdatePasswordOperation from 'src/core/users/operations/users/UpdatePasswordOperation';

describe('Core :: Users :: Operations :: UpdatePasswordOperation', () => {
    let updatePasswordOperation: UpdatePasswordOperation,
        updatePasswordService: any,
        usersSchema: any,
        schemaValidator: any,
        payload: any;

    const logger = (): void => {};

    context('When get users with success', () => {
        before(() => {
            usersSchema = {
                passwordUpdateZod: {},
            };

            schemaValidator = { entry: sinon.spy(() => {}) };

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
                schemaValidator,
                usersSchema,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            await updatePasswordOperation.execute(payload);

            expect(schemaValidator.entry).to.have.been.called();
            expect(updatePasswordService.update).to.have.been.called();
        });
    });
});
