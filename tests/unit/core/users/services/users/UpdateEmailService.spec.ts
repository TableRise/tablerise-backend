import sinon from 'sinon';
import UpdateEmailService from 'src/core/users/services/users/UpdateEmailService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: UpdateEmailService', () => {
    let updateEmailService: UpdateEmailService,
        user: UserInstance,
        newUser: UserInstance,
        usersRepository: any,
        updateEmailPayload: any;

    const logger = (): void => {};

    context('#update', () => {
        context('When an email is updated', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.inProgress.status = 'wait_to_verify';

                updateEmailPayload = {
                    userId: user.userId,
                    code: user.inProgress.code,
                    email: 'testnew@email.com',
                };

                newUser = {
                    ...user,
                    email: updateEmailPayload.email,
                    inProgress: { status: 'done', code: updateEmailPayload.code },
                };

                usersRepository = {
                    findOne: sinon.spy(() => user),
                    find: () => [],
                    update: sinon.spy(),
                };

                updateEmailService = new UpdateEmailService({
                    usersRepository,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                await updateEmailService.update(updateEmailPayload);
                expect(usersRepository.findOne).to.have.been.called();
                expect(usersRepository.update).to.have.been.calledWith({
                    query: { userId: user.userId },
                    payload: newUser,
                });
            });
        });

        context('When an email is updated - email is invalid', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.inProgress.status = 'wait_to_verify';

                updateEmailPayload = {
                    userId: user.userId,
                    code: user.inProgress.code,
                    email: user.email,
                };

                newUser = {
                    ...user,
                    email: updateEmailPayload.email,
                    inProgress: { status: 'done', code: updateEmailPayload.code },
                };

                usersRepository = {
                    findOne: sinon.spy(() => user),
                    find: () => [{ email: user.email }],
                    update: sinon.spy(),
                };

                updateEmailService = new UpdateEmailService({
                    usersRepository,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                try {
                    await updateEmailService.update(updateEmailPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Email already exists in database');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.BAD_REQUEST)
                    );
                }
            });
        });
    });
});
