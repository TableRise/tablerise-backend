import sinon from 'sinon';
import VerifyEmailService from 'src/core/users/services/users/VerifyEmailService';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';

import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Core :: Users :: Services :: VerifyEmailService', () => {
    let verifyEmailService: VerifyEmailService,
        usersRepository: any,
        emailSender: any,
        user: UserInstance,
        payload: any,
        httpRequestErrors: HttpRequestErrors;

    const logger = (): void => {};

    context('#sendEmail', () => {
        context('When sendEmail with success - Without newEmail', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(() => ({})),
                };

                emailSender = {
                    send: () => ({
                        success: true,
                    }),
                };

                payload = {
                    email: 'oldEmail',
                };

                verifyEmailService = new VerifyEmailService({
                    usersRepository,
                    emailSender,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                await verifyEmailService.sendEmail(payload);

                expect(usersRepository.update).to.have.been.called();
            });
        });

        context('When sendEmail with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(() => ({})),
                };

                emailSender = {
                    send: () => ({
                        success: true,
                    }),
                };

                payload = {
                    email: 'oldEmail',
                    newEmail: 'newEmail',
                };

                verifyEmailService = new VerifyEmailService({
                    usersRepository,
                    emailSender,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                await verifyEmailService.sendEmail(payload);

                expect(usersRepository.update).to.have.been.called();
            });
        });

        context('When sendEmail fail', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(() => ({})),
                };

                emailSender = {
                    send: () => ({
                        success: false,
                    }),
                };

                payload = {
                    email: 'oldEmail',
                    newEmail: 'newEmail',
                };

                verifyEmailService = new VerifyEmailService({
                    usersRepository,
                    emailSender,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await verifyEmailService.sendEmail(payload);

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.name).to.be.equal('NotFound');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                }
            });
        });
    });
});
