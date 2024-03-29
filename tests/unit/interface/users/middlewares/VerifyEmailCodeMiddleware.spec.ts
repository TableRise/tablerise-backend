import { Request, Response, NextFunction } from 'express';
import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import VerifyEmailCodeMiddleware from 'src/interface/users/middlewares/VerifyEmailCodeMiddleware';

describe('Interface :: Users :: Middlewares :: VerifyEmailCodeMiddleware', () => {
    let verifyEmailCodeMiddleware: VerifyEmailCodeMiddleware,
        usersRepository: any,
        user: any;

    const logger = (): unknown => ({});

    context('When the user has the email code verified', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        response.status = sinon.spy(() => response);
        response.json = sinon.spy(() => response);

        context('And params are correct', () => {
            beforeEach(() => {
                user = {
                    userId: '123',
                    inProgress: {
                        status: 'wait_to_verify',
                        code: 'KLI44',
                    },
                };

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(),
                };

                verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                    usersRepository,
                    logger,
                });
            });

            it('should call next - when has ID', async () => {
                request.params = { id: '123' };
                request.query = { code: 'KLI44' };

                await verifyEmailCodeMiddleware.verify(request, response, next);

                user.inProgress.status = 'done';

                expect(usersRepository.update).to.have.been.calledWith({
                    query: { userId: '123' },
                    payload: user,
                });
                expect(next).to.have.been.called();
            });

            it('should call next - when has email', async () => {
                delete request.params.id;
                request.query = { email: 'test@email.com', code: 'KLI44' };

                await verifyEmailCodeMiddleware.verify(request, response, next);

                user.inProgress.status = 'done';

                expect(usersRepository.update).to.have.been.calledWith({
                    query: { userId: '123' },
                    payload: user,
                });
                expect(next).to.have.been.called();
            });
        });

        context('And params are incorrect', () => {
            beforeEach(() => {
                usersRepository = { findOne: () => null };

                verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                    usersRepository,
                    logger,
                });
            });

            it('should throw an error - no id or email', async () => {
                try {
                    delete request.params.id;
                    request.query = { code: 'KLI44' };
                    await verifyEmailCodeMiddleware.verify(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Neither id or email was provided to validate the email code'
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal('BadRequest');
                }
            });
        });

        context('And params are incorrect - id or email inexistent', () => {
            beforeEach(() => {
                usersRepository = {
                    findOne: () => {
                        // eslint-disable-next-line @typescript-eslint/no-throw-literal
                        throw HttpRequestErrors.throwError('user-inexistent');
                    },
                };

                verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                    usersRepository,
                    logger,
                });
            });

            it('should throw an error - id inexistent', async () => {
                try {
                    request.params = { id: '123' };
                    request.query = { code: 'KLI44' };
                    await verifyEmailCodeMiddleware.verify(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });

            it('should throw an error - email inexistent', async () => {
                try {
                    request.query = { email: 'test@email.com', code: 'KLI44' };
                    await verifyEmailCodeMiddleware.verify(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });

        context('And params are correct - but code is invalid', () => {
            beforeEach(() => {
                usersRepository = {
                    findOne: () => ({
                        inProgress: {
                            status: 'wait_to_verify',
                            code: 'KLI44',
                        },
                    }),
                };

                verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                    usersRepository,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    request.params = { id: '123' };
                    request.query = { code: 'KLI00' };

                    await verifyEmailCodeMiddleware.verify(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Invalid email verify code');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal('BadRequest');
                }
            });
        });

        context('And params are correct - but status is invalid', () => {
            beforeEach(() => {
                usersRepository = {
                    findOne: () => ({
                        inProgress: {
                            status: 'done',
                            code: 'KLI44',
                        },
                    }),
                };

                verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                    usersRepository,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    request.params = { id: '123' };
                    request.query = { code: 'KLI00' };

                    await verifyEmailCodeMiddleware.verify(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'User status is invalid to perform this operation'
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal('BadRequest');
                }
            });
        });
    });
});
