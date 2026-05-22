import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import AuthorizationMiddleware from 'src/interface/common/middlewares/AuthorizationMiddleware';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import StateMachine from 'src/domains/common/StateMachine';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

describe('Interface :: Common :: Middlewares :: AuthorizationMiddleware', () => {
    const logger = (): void => {};

    const stateMachine = {
        props: StateMachine.prototype.props,
        machine: sinon.stub().returns({
            userId: '123',
            inProgress: { status: InProgressStatusEnum.enum.DONE },
            updatedAt: '2024-12-12T00:00:00.000Z',
        }),
    } as any;

    let usersRepository: any;
    let usersDetailsRepository: any;
    let twoFactorHandler: any;
    let authorizationMiddleware: AuthorizationMiddleware;

    beforeEach(() => {
        usersRepository = {};
        usersDetailsRepository = {};
        twoFactorHandler = {};
    });

    it('should allow admin users in checkAdminRole', async () => {
        const request = { user: { userId: '123' } } as unknown as Request;
        const response = {} as Response;
        const next = sinon.spy() as unknown as NextFunction;

        usersDetailsRepository.findOne = sinon.stub().returns({ role: 'admin' });

        authorizationMiddleware = new AuthorizationMiddleware({
            schemaValidator: { entry: sinon.stub() },
            usersSchemas: { postAuthenticate2FA: { query: {} } },
            usersRepository,
            usersDetailsRepository,
            stateMachine,
            twoFactorHandler,
            logger,
        } as any);

        await authorizationMiddleware.checkAdminRole(request, response, next);

        expect(next).to.have.been.calledOnce();
    });

    it('should advance the flow when 2FA is valid', async () => {
        const request = {
            query: { email: 'test@email.com', token: '123456', flow: 'update-password' },
        } as unknown as Request;
        const response = { locals: {} } as Response;
        const next = sinon.spy() as unknown as NextFunction;

        usersRepository.findOne = sinon.stub().returns({
            userId: '123',
            inProgress: { status: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH },
            twoFactorSecret: { active: true, secret: 'secret' },
        });
        twoFactorHandler.validate = sinon.stub().returns(true);

        authorizationMiddleware = new AuthorizationMiddleware({
            schemaValidator: { entry: sinon.stub() },
            usersSchemas: { postAuthenticate2FA: { query: {} } },
            usersRepository,
            usersDetailsRepository,
            stateMachine,
            twoFactorHandler,
            logger,
        } as any);

        await authorizationMiddleware.twoFactor(request, response, next);

        expect(twoFactorHandler.validate).to.have.been.calledOnce();
        expect(stateMachine.machine).to.have.been.calledOnce();
        expect(response.locals.accountSecurityMethod).to.be.equal('two-factor');
        expect(next).to.have.been.calledOnce();
    });

    it('should throw when 2FA is not active', async () => {
        const request = {
            query: { email: 'test@email.com', token: '123456', flow: 'update-password' },
        } as unknown as Request;
        const response = {} as Response;
        const next = sinon.spy() as unknown as NextFunction;

        usersRepository.findOne = sinon.stub().returns({
            userId: '123',
            inProgress: { status: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH },
            twoFactorSecret: { active: false, secret: 'secret' },
        });
        twoFactorHandler.validate = sinon.stub().returns(true);

        authorizationMiddleware = new AuthorizationMiddleware({
            schemaValidator: { entry: sinon.stub() },
            usersSchemas: { postAuthenticate2FA: { query: {} } },
            usersRepository,
            usersDetailsRepository,
            stateMachine,
            twoFactorHandler,
            logger,
        } as any);

        try {
            await authorizationMiddleware.twoFactor(request, response, next);
            expect.fail('Expected error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.be.equal('2FA not enabled for this user');
            expect(err.name).to.be.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
            expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
        }
    });
});
