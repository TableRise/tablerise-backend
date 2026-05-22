import DeactivateTwoFactorService from 'src/core/users/services/users/DeactivateTwoFactorService';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import StateMachine from 'src/domains/common/StateMachine';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import sinon from 'sinon';

describe('Core :: Users :: Services :: DeactivateTwoFactorService', () => {
    let deactivateTwoFactorService: DeactivateTwoFactorService, usersRepository: any, user: User;

    const logger = (): void => {};

    const stateMachine = {
        props: StateMachine.prototype.props,
        machine: () => ({
            userId: '123',
            inProgress: { status: 'done' },
            twoFactorSecret: { active: false },
            updatedAt: '12-12-2024T00:00:00Z',
        }),
    } as any;

    context('#deactivate', () => {
        context('When deactivate an user two factor with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.inProgress.status = stateMachine.props.status.WAIT_TO_DISABLE_TWO_FACTOR;
                user.twoFactorSecret = { active: true, qrcode: 'qr-code', secret: 'secret-code' };

                usersRepository = {
                    findOne: () => user,
                };

                deactivateTwoFactorService = new DeactivateTwoFactorService({
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userTest = await deactivateTwoFactorService.deactivate('userId');

                expect(userTest).to.be.equal(user);
                expect(userTest.twoFactorSecret).to.be.deep.equal({
                    active: false,
                    qrcode: '',
                    secret: '',
                });
            });
        });

        context('When deactivate an user two factor but user status is wrong', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.inProgress.status = stateMachine.props.status.WAIT_TO_CONFIRM;
                user.twoFactorSecret = { active: true, qrcode: 'qr-code', secret: 'secret-code' };

                usersRepository = {
                    findOne: sinon.spy(() => user),
                };

                deactivateTwoFactorService = new DeactivateTwoFactorService({
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await deactivateTwoFactorService.deactivate('userId');
                    expect(usersRepository.findOne).to.have.been.called();
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User status is invalid to perform this operation');
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });

        context('When deactivate an user two factor fail | 2fa-no-active', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.inProgress.status = stateMachine.props.status.WAIT_TO_DISABLE_TWO_FACTOR;
                user.twoFactorSecret = { active: false, qrcode: '', secret: '' };

                usersRepository = {
                    findOne: () => user,
                };

                deactivateTwoFactorService = new DeactivateTwoFactorService({
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await deactivateTwoFactorService.deactivate('userId');

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('2FA not enabled for this user');
                    expect(err.name).to.be.equal('BadRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });
    });

    context('#save', () => {
        context('When save an user with disabled two factor with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                user.twoFactorSecret = { active: false, qrcode: '', secret: '' };

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                deactivateTwoFactorService = new DeactivateTwoFactorService({
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should persist the updated user', async () => {
                await deactivateTwoFactorService.save(user);

                expect(usersRepository.update).to.have.been.calledWith({
                    query: { userId: user.userId },
                    payload: user,
                });
            });
        });
    });
});
