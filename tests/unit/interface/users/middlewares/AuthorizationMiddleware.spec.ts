import { Request, Response, NextFunction } from 'express';
import speakeasy from 'speakeasy';
import sinon from 'sinon';
import AuthorizationMiddleware from 'src/interface/users/middlewares/AuthorizationMiddleware';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';

describe('Interface :: Users :: Middlewares :: AuthorizationMiddleware', () => {
    let authorizationMiddleware: AuthorizationMiddleware,
    usersRepository: any,
    usersDetailsRepository: any;

    const logger = (): unknown => ({});

    context('When the user has the role checked', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        response.status = sinon.spy(() => response);
        response.json = sinon.spy(() => response);

        context('And the user is admin', () => {
            beforeEach(() => {
                usersRepository = {};
    
                usersDetailsRepository = {findOne: () => ({
                    role: 'admin'
                })};
    
                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    logger
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
    
                usersDetailsRepository = {findOne: () => null};
    
                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    logger
                });
            });

            it('should call next', async () => {
                try {
                    request.user = { userId: '123' };
                    await authorizationMiddleware.checkAdminRole(request, response, next);
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
    
                usersDetailsRepository = {findOne: () => ({
                    role: 'user'
                })};
    
                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    logger
                });
            });

            it('should call next', async () => {
                try {
                    request.user = { userId: '123' };
                    await authorizationMiddleware.checkAdminRole(request, response, next);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Unauthorized');
                    expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
                    expect(err.name).to.be.equal('Unauthorized');
                }
            });
        });
    });

    context('When the user has 2FA', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        response.status = sinon.spy(() => response);
        response.json = sinon.spy(() => response);

        context('And the 2FA token is correct', () => {
            beforeEach(() => {
                usersRepository = {findOne: () => ({
                    twoFactorSecret: {
                        active: true
                    }
                })}
    
                usersDetailsRepository = {};
    
                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    logger
                });

                sinon.stub(speakeasy.totp, 'verify').returns(true);
            });

            afterEach(() => {
                sinon.restore();
            });

            it('should call next', async () => {
                request.params = { id: '123' };
                request.query = { token: '123' };

                await authorizationMiddleware.twoFactor(request, response, next);

                expect(speakeasy.totp.verify).to.have.been.called();
                expect(next).to.have.been.called();
            });
        });

        context('And the 2FA token is incorrect - user inexistent', () => {
            beforeEach(() => {
                usersRepository = { findOne: () => null };
                usersDetailsRepository = {};
    
                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    logger
                });

                sinon.stub(speakeasy.totp, 'verify').returns(true);
            });

            afterEach(() => {
                sinon.restore();
            });

            it('should throw an error', async () => {
                try {
                    request.params = { id: '123' };
                    request.query = { token: '123' };
    
                    await authorizationMiddleware.twoFactor(request, response, next);
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
                usersRepository = usersRepository = {findOne: () => ({
                    twoFactorSecret: {
                        active: false
                    }
                })};

                usersDetailsRepository = {};
    
                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    logger
                });

                sinon.stub(speakeasy.totp, 'verify').returns(true);
            });

            afterEach(() => {
                sinon.restore();
            });

            it('should call next but not verify the code', async () => {
                request.params = { id: '123' };
                request.query = { token: '123' };

                await authorizationMiddleware.twoFactor(request, response, next);

                expect(next).to.have.been.called();
                expect(speakeasy.totp.verify).to.have.not.been.called();
            });
        });

        context('And the 2FA token is incorrect - 2FA incorrect', () => {
            beforeEach(() => {
                usersRepository = usersRepository = {findOne: () => ({
                    twoFactorSecret: {
                        active: true
                    }
                })};

                usersDetailsRepository = {};
    
                authorizationMiddleware = new AuthorizationMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    logger
                });

                sinon.stub(speakeasy.totp, 'verify').returns(false);
            });

            afterEach(() => {
                sinon.restore();
            });

            it('should call next but not verify the code', async () => {
                try {
                    request.params = { id: '123' };
                    request.query = { token: '123' };
    
                    await authorizationMiddleware.twoFactor(request, response, next);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Two factor code does not match');
                    expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
                    expect(err.name).to.be.equal('Unauthorized');
                }
            });
        });
    });
});
