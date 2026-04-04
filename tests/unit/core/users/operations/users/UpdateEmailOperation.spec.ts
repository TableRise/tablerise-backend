import sinon from 'sinon';
import UpdateEmailOperation from 'src/core/users/operations/users/UpdateEmailOperation';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Users :: Operations :: Users :: UpdateEmailOperation', () => {
    let updateEmailOperation: UpdateEmailOperation,
        updateEmailService: any,
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
                    email: 'newemail@email.com',
                };

                updateEmailOperation = new UpdateEmailOperation({
                    updateEmailService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await updateEmailOperation.execute(updateEmailPayload);
                expect(updateEmailService.update).to.have.been.calledWith(updateEmailPayload);
            });
        });

        context('When an email is updated - wrong payload', () => {
            const userId = newUUID();

            before(() => {
                updateEmailService = {
                    update: sinon.spy(() => { throw new Error('error throw') }),
                };

                updateEmailPayload = {
                    userId,
                    code: 'AS451L',
                    email: 'newemail@email.com',
                };

                updateEmailOperation = new UpdateEmailOperation({
                    updateEmailService,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updateEmailOperation.execute(updateEmailPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error: any) {
                    expect(error.message).to.be.equal('error throw');
                }
            });
        });
    });
});
