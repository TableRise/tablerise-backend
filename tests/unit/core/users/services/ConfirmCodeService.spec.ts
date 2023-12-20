import sinon from 'sinon';
import ConfirmCodeService from 'src/core/users/services/users/ConfirmCodeService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Core :: Users :: Services :: ConfirmCodeService', () => {
    let usersRepositoryMock: any;
    let loggerMock: any;
    let confirmCodeService: any;

    context('When the method to confirm code is called', () => {
        beforeEach(() => {
            usersRepositoryMock = {
                findOne: sinon.stub(),
                update: sinon.stub(),
            };
            loggerMock = sinon.stub();

            confirmCodeService = new ConfirmCodeService({
                usersRepository: usersRepositoryMock,
                logger: loggerMock,
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should process code correctly', async () => {
            const userId = 'anyId';
            const code = 'validCode';
            const userInDb = {
                userId,
                inProgress: {
                    code: 'validCode',
                    status: 'inProgress',
                },
            };

            usersRepositoryMock.findOne.withArgs({ userId }).resolves(userInDb);

            await confirmCodeService.processCode({ userId, code });

            expect(loggerMock).to.be.calledOnce();
            expect(usersRepositoryMock.findOne).to.be.calledOnce();
            expect(usersRepositoryMock.update).to.be.calledOnce();

            const updatedUser = {
                userId,
                inProgress: {
                    code: 'validCode',
                    status: 'done',
                },
            };

            expect(usersRepositoryMock.update).to.be.calledWith({
                query: { userId },
                payload: updatedUser,
            });
        });

        it('should throw error for invalid code', async () => {
            const userId = 'anyId';
            const code = 'invalidCode';
            const userInDb = {
                userId,
                inProgress: {
                    code: 'validCode',
                    status: 'inProgress',
                },
            };

            usersRepositoryMock.findOne.withArgs({ userId }).resolves(userInDb);

            try {
                await confirmCodeService.processCode({ userId, code });
                expect(loggerMock).to.be.calledOnce();
                expect(usersRepositoryMock.findOne).to.be.calledOnce();
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).to.be.instanceOf(HttpRequestErrors);
                expect(err.message).to.equal('Invalid email verify code');
                expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
                expect(err.name).to.equal('BadRequest');
                expect(usersRepositoryMock.update).to.be.not.called();
            }
        });
    });
});
