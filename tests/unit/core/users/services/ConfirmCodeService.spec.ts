import sinon from 'sinon';
import ConfirmCodeService from 'src/core/users/services/users/ConfirmCodeService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Core :: Users :: Services :: ConfirmCodeService', () => {
    let confirmCodeService: ConfirmCodeService;
    let usersRepositoryMock: any;

    const logger = (): void => {};

    context('When the method to confirm code is called', () => {
        const userId = 'anyId';
        const code = 'validCode';
        const userInDb = {
            userId,
            inProgress: {
                code: 'validCode',
                status: 'inProgress',
            },
        };
        const updatedUser = {
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

            confirmCodeService = new ConfirmCodeService({
                usersRepository: usersRepositoryMock,
                logger,
            });
        });

        it('should process code correctly', async () => {
            await confirmCodeService.processCode({ userId, code });

            expect(usersRepositoryMock.findOne).to.have.been.called();
            expect(usersRepositoryMock.update).to.have.been.called();
            expect(usersRepositoryMock.update).to.have.been.calledWith({
                query: { userId },
                payload: updatedUser,
            });
        });
    });

    context('When the method to confirm code is called - invalid code', () => {
        const userId = 'anyId';
        const code = 'invalidCode';
        const userInDb = {
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

            confirmCodeService = new ConfirmCodeService({
                usersRepository: usersRepositoryMock,
                logger,
            });
        });

        it('should throw error for invalid code', async () => {
            try {
                await confirmCodeService.processCode({ userId, code });
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
