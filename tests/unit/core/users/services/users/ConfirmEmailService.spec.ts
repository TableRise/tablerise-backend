import sinon from 'sinon';
import ConfirmEmailService from 'src/core/users/services/users/ConfirmEmailService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Core :: Users :: Services :: ConfirmEmailService', () => {
    let confirmEmailService: ConfirmEmailService;
    let usersRepositoryMock: any;

    const logger = (): void => {};

    context('When the method to confirm email is called', () => {
        const email = 'anyEmail';
        const userId = 'anyId';
        const code = 'validCode';
        const userInDb = {
            email,
            userId,
            inProgress: {
                code: 'validCode',
                status: 'inProgress',
            },
        };
        const updatedUser = {
            email,
            userId,
            inProgress: {
                code: 'validCode',
                status: 'done',
            },
        };

        before(() => {
            usersRepositoryMock = {
                findOne: sinon.spy(() => userInDb),
                update: sinon.spy(() => ({})),
            };

            confirmEmailService = new ConfirmEmailService({
                usersRepository: usersRepositoryMock,
                logger,
            });
        });

        it('should process code correctly', async () => {
            await confirmEmailService.processCode({ email, code });

            expect(usersRepositoryMock.findOne).to.have.been.called();
            expect(usersRepositoryMock.update).to.have.been.called();
            expect(usersRepositoryMock.update).to.have.been.calledWith({
                query: { userId },
                payload: updatedUser,
            });
        });
    });

    context('When the method to confirm code is called - invalid code', () => {
        const email = 'anyEmail';
        const userId = 'anyId';
        const code = 'invalidCode';
        const userInDb = {
            email,
            userId,
            inProgress: {
                code: 'validCode',
                status: 'inProgress',
            },
        };

        before(() => {
            usersRepositoryMock = {
                findOne: sinon.spy(() => userInDb),
                update: sinon.spy(() => ({})),
            };

            confirmEmailService = new ConfirmEmailService({
                usersRepository: usersRepositoryMock,
                logger,
            });
        });

        it('should throw error for invalid code', async () => {
            try {
                await confirmEmailService.processCode({ email, code });
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).to.be.instanceOf(HttpRequestErrors);
                expect(err.message).to.equal('Invalid email verify code');
                expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
                expect(err.name).to.equal('BadRequest');
            }
        });
    });
});
