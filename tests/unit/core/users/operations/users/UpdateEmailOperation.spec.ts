import sinon from 'sinon';
import UpdateEmailOperation from 'src/core/users/operations/users/UpdateEmailOperation';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Users :: Operations :: Users :: UpdateEmailOperation', () => {
    let updateEmailOperation: UpdateEmailOperation,
        updateEmailService: any,
        usersSchema: any,
        schemaValidator: any,
        updateEmailPayload: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When an email is updated', () => {
            const userId = newUUID();

            before(() => {
                updateEmailService = {
                    update: sinon.spy(),
                };

                updateEmailPayload = {
                    userId,
                    code: 'AS451L',
                    email: 'newemail@email.com',
                };

                usersSchema = {
                    emailUpdateZod: {},
                };

                schemaValidator = {
                    entry: sinon.spy(),
                };

                updateEmailOperation = new UpdateEmailOperation({
                    updateEmailService,
                    usersSchema,
                    schemaValidator,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await updateEmailOperation.execute(updateEmailPayload);
                expect(schemaValidator.entry).to.have.been.calledWith(
                    {},
                    { email: updateEmailPayload.email }
                );
                expect(updateEmailService.update).to.have.been.calledWith(
                    updateEmailPayload
                );
            });
        });

        context('When an email is updated - wrong payload', () => {
            const userId = newUUID();

            before(() => {
                updateEmailService = {
                    update: sinon.spy(),
                };

                updateEmailPayload = {
                    userId,
                    code: 'AS451L',
                    email: 'newemail@email.com',
                };

                usersSchema = {
                    emailUpdateZod: {},
                };

                schemaValidator = {
                    entry: () => {
                        throw new Error('Schema error');
                    },
                };

                updateEmailOperation = new UpdateEmailOperation({
                    updateEmailService,
                    usersSchema,
                    schemaValidator,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updateEmailOperation.execute(updateEmailPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as Error;
                    expect(err.message).to.be.equal('Schema error');
                }
            });
        });
    });
});
