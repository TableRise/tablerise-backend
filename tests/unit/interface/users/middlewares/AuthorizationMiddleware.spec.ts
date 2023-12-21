import { Request, Response, NextFunction } from 'express';
import sinon from 'sinon';
import AuthorizationMiddleware from 'src/interface/users/middlewares/AuthorizationMiddleware';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import questionEnum from 'src/domains/user/enums/questionEnum';

describe('Interface :: Users :: Middlewares :: AuthorizationMiddleware', () => {
    let authorizationMiddleware: AuthorizationMiddleware,
        usersRepository: any,
        usersDetailsRepository: any,
        twoFactorHandler: any;

    const logger = (): unknown => ({});

    context('When user has the role checked', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        response.status = sinon.spy(() => response);
        response.json = sinon.spy(() => response);

        context('And the user is admin', () => {
            beforeEach(() => {
                usersRepository = {};

                twoFactorHandler = {};

                usersDetailsRepository = {
                    findOne: () => ({
                        role: 'admin',
                    }),
                };

                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    logger,
                });
            });

            it('should call next', async () => {
                request.user = { userId: '123' };

                await authorizationMiddleware.checkAdminRole(request, response, next);

                expect(next).to.have.been.called();
            });
        });

        context('And the user not exist', () => {
            beforeEach(() => {
                usersRepository = {};

                usersDetailsRepository = { findOne: () => null };

                twoFactorHandler = {};

                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    logger,
                });
            });

            it('should call next', async () => {
                try {
                    request.user = { userId: '123' };
                    await authorizationMiddleware.checkAdminRole(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });

        context('And the user is not admin', () => {
            beforeEach(() => {
                usersRepository = {};

                twoFactorHandler = {};

                usersDetailsRepository = {
                    findOne: () => ({
                        role: 'user',
                    }),
                };

                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    logger,
                });
            });

            it('should call next', async () => {
                try {
                    request.user = { userId: '123' };
                    await authorizationMiddleware.checkAdminRole(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Unauthorized');
                    expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
                    expect(err.name).to.be.equal('Unauthorized');
                }
            });
        });
    });

    context('When user has 2FA', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        response.status = sinon.spy(() => response);
        response.json = sinon.spy(() => response);

        context('And the 2FA token is correct', () => {
            beforeEach(() => {
                usersRepository = {
                    findOne: () => ({
                        twoFactorSecret: {
                            active: true,
                        },
                    }),
                };

                usersDetailsRepository = {};

                twoFactorHandler = {
                    validate: sinon.spy(() => true),
                };

                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    logger,
                });
            });

            afterEach(() => {
                sinon.restore();
            });

            it('should call next', async () => {
                request.params = { id: '123' };
                request.query = { token: '123' };

                await authorizationMiddleware.twoFactor(request, response, next);

                expect(twoFactorHandler.validate).to.have.been.called();
                expect(next).to.have.been.called();
            });
        });

        context('And the 2FA token is incorrect - user inexistent', () => {
            beforeEach(() => {
                usersRepository = { findOne: () => null };
                usersDetailsRepository = {};

                twoFactorHandler = {};

                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    logger,
                });
            });

            afterEach(() => {
                sinon.restore();
            });

            it('should throw an error', async () => {
                try {
                    request.params = { id: '123' };
                    request.query = { token: '123' };

                    await authorizationMiddleware.twoFactor(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });

        context('And the 2FA token is incorrect - 2FA not active', () => {
            beforeEach(() => {
                usersRepository = usersRepository = {
                    findOne: () => ({
                        twoFactorSecret: {
                            active: false,
                        },
                    }),
                };

                usersDetailsRepository = {};

                twoFactorHandler = {
                    validate: sinon.spy(() => true),
                };

                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    logger,
                });
            });

            afterEach(() => {
                sinon.restore();
            });

            it('should call next but not verify the code', async () => {
                request.params = { id: '123' };
                request.query = { token: '123' };

                await authorizationMiddleware.twoFactor(request, response, next);

                expect(next).to.have.been.called();
                expect(twoFactorHandler.validate).to.have.not.been.called();
            });
        });

        context('And the 2FA token is incorrect - 2FA incorrect', () => {
            beforeEach(() => {
                usersRepository = usersRepository = {
                    findOne: () => ({
                        twoFactorSecret: {
                            active: true,
                        },
                    }),
                };

                usersDetailsRepository = {};

                twoFactorHandler = {
                    validate: sinon.spy(() => false),
                };

                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    logger,
                });
            });

            afterEach(() => {
                sinon.restore();
            });

            it('should call next but not verify the code', async () => {
                try {
                    request.params = { id: '123' };
                    request.query = { token: '123' };

                    await authorizationMiddleware.twoFactor(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Two factor code does not match');
                    expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
                    expect(err.name).to.be.equal('Unauthorized');
                }
            });
        });
    });

    context('When user has secret question', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        response.status = sinon.spy(() => response);
        response.json = sinon.spy(() => response);

        context('And question/answer are correct', () => {
            const secretQuestion = {
                question: questionEnum.enum.WHAT_COLOR_DO_YOU_LIKE_THE_MOST,
                answer: 'red',
            };

            beforeEach(() => {
                usersRepository = {};

                usersDetailsRepository = {
                    findOne: () => ({
                        secretQuestion,
                    }),
                };

                twoFactorHandler = {};

                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    logger,
                });
            });

            it('should call next', async () => {
                request.params = { id: '123' };
                request.body = secretQuestion;
                await authorizationMiddleware.secretQuestion(request, response, next);

                expect(next).to.have.been.called();
            });

            it('should call next - question/answer in query', async () => {
                request.body = null;
                request.params = { id: '123' };
                request.query = secretQuestion;
                await authorizationMiddleware.secretQuestion(request, response, next);

                expect(next).to.have.been.called();
            });
        });

        context('And question/answer are incorrect', () => {
            const secretQuestionWrong = {
                question: questionEnum.enum.WHAT_COLOR_DO_YOU_LIKE_THE_MOST,
                answer: 'red',
            };

            const secretQuestionAnswerWrong = {
                question: questionEnum.enum.WHAT_IS_YOUR_FAVORITE_ARTIST,
                answer: 'blue',
            };

            beforeEach(() => {
                usersRepository = {};

                usersDetailsRepository = {
                    findOne: () => ({
                        secretQuestion: {
                            question: questionEnum.enum.WHAT_IS_YOUR_FAVORITE_ARTIST,
                            answer: 'red',
                        },
                    }),
                };

                twoFactorHandler = {};

                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    logger,
                });
            });

            it('should not call next and throws an error - question', async () => {
                try {
                    request.params = { id: '123' };
                    request.body = secretQuestionWrong;
                    await authorizationMiddleware.secretQuestion(request, response, next);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Secret question is incorrect');
                    expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
                    expect(err.name).to.be.equal('Unauthorized');
                }
            });

            it('should not call next and throws an error - answer', async () => {
                try {
                    request.params = { id: '123' };
                    request.body = secretQuestionAnswerWrong;
                    await authorizationMiddleware.secretQuestion(request, response, next);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Secret question is incorrect');
                    expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
                    expect(err.name).to.be.equal('Unauthorized');
                }
            });
        });

        context('Secret question is null', () => {
            const secretQuestion = {
                question: questionEnum.enum.WHAT_COLOR_DO_YOU_LIKE_THE_MOST,
                answer: 'red',
            };

            beforeEach(() => {
                usersRepository = {};

                usersDetailsRepository = {
                    findOne: () => ({
                        secretQuestion: null,
                    }),
                };

                twoFactorHandler = {};

                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    logger,
                });
            });

            it('should call next', async () => {
                request.params = { id: '123' };
                request.body = secretQuestion;
                await authorizationMiddleware.secretQuestion(request, response, next);

                expect(next).to.have.been.called(1);
            });
        });
    });
});
