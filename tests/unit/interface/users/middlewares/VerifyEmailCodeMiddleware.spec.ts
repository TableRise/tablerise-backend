import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import VerifyEmailCodeMiddleware from 'src/interface/users/middlewares/VerifyEmailCodeMiddleware';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import StateMachine from 'src/domains/common/StateMachine';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Interface :: Users :: Middlewares :: VerifyEmailCodeMiddleware', () => {
    const logger = (): void => {};

    let usersRepository: any;
    let verifyEmailCodeMiddleware: VerifyEmailCodeMiddleware;
    let stateMachine: any;

    beforeEach(() => {
        stateMachine = {
            props: StateMachine.prototype.props,
            machine: sinon.stub(),
        };
    });

    it('should continue with two-factor when the flow is valid', async () => {
        const request = {
            params: { id: '123' },
            query: { code: 'KLI44', flow: 'update-password' },
        } as unknown as Request;
        const response = { locals: {} } as Response;
        const next = sinon.spy() as unknown as NextFunction;

        usersRepository = {
            findOne: sinon.stub().returns({
                userId: '123',
                inProgress: {
                    status: InProgressStatusEnum.enum.WAIT_TO_START_PASSWORD_CHANGE,
                    code: 'KLI44',
                },
                twoFactorSecret: { active: true },
            }),
        };

        stateMachine.machine.returns({
            userId: '123',
            inProgress: { status: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH },
            twoFactorSecret: { active: true },
            updatedAt: '2024-12-12T00:00:00.000Z',
        });

        verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
            usersRepository,
            usersDetailsRepository: {},
            stateMachine,
            schemaValidator: { entry: sinon.stub() },
            usersSchemas: { postAuthenticateEmail: { query: {} } },
            logger,
        } as any);

        await verifyEmailCodeMiddleware.verify(request, response, next);

        expect(stateMachine.machine).to.have.been.calledOnce();
        expect(response.locals.accountSecurityMethod).to.be.equal('two-factor');
        expect(next).to.have.been.calledOnce();
    });

    it('should throw 2fa-no-active when the next step requires second auth but 2FA is disabled', async () => {
        const request = {
            params: { id: '123' },
            query: { code: 'KLI44', flow: 'update-password' },
        } as unknown as Request;
        const response = { locals: {} } as Response;
        const next = sinon.spy() as unknown as NextFunction;

        usersRepository = {
            findOne: sinon.stub().returns({
                userId: '123',
                inProgress: {
                    status: InProgressStatusEnum.enum.WAIT_TO_START_PASSWORD_CHANGE,
                    code: 'KLI44',
                },
                twoFactorSecret: { active: false },
            }),
        };

        stateMachine.machine.returns({
            userId: '123',
            inProgress: { status: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH },
            twoFactorSecret: { active: false },
            updatedAt: '2024-12-12T00:00:00.000Z',
        });

        verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
            usersRepository,
            usersDetailsRepository: {},
            stateMachine,
            schemaValidator: { entry: sinon.stub() },
            usersSchemas: { postAuthenticateEmail: { query: {} } },
            logger,
        } as any);

        try {
            await verifyEmailCodeMiddleware.verify(request, response, next);
            expect.fail('Expected error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.be.equal('2FA not enabled for this user');
            expect(err.name).to.be.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
            expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
        }
    });

    it('should throw when the email verification code is invalid', async () => {
        const request = {
            params: { id: '123' },
            query: { code: 'WRONG', flow: 'create-user' },
        } as unknown as Request;
        const response = {} as Response;
        const next = sinon.spy() as unknown as NextFunction;

        usersRepository = {
            findOne: sinon.stub().returns({
                userId: '123',
                inProgress: {
                    status: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
                    code: 'KLI44',
                },
                twoFactorSecret: { active: true },
            }),
        };

        verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
            usersRepository,
            usersDetailsRepository: {},
            stateMachine,
            schemaValidator: { entry: sinon.stub() },
            usersSchemas: { postAuthenticateEmail: { query: {} } },
            logger,
        } as any);

        try {
            await verifyEmailCodeMiddleware.verify(request, response, next);
            expect.fail('Expected error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.be.equal('Invalid email verify code');
            expect(err.name).to.be.equal(getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY));
            expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
        }
    });

    it('should use email lookup when id is not present and continue without second auth', async () => {
        const request = {
            params: {},
            query: { email: 'test@email.com', code: 'KLI44', flow: 'create-user' },
        } as unknown as Request;
        const response = { locals: {} } as Response;
        const next = sinon.spy() as unknown as NextFunction;

        usersRepository = {
            findOne: sinon.stub().returns({
                userId: '123',
                inProgress: {
                    status: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
                    code: 'KLI44',
                },
                twoFactorSecret: { active: false },
            }),
        };

        stateMachine.machine.returns({
            userId: '123',
            inProgress: { status: InProgressStatusEnum.enum.DONE },
            twoFactorSecret: { active: false },
            updatedAt: '2024-12-12T00:00:00.000Z',
        });

        verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
            usersRepository,
            usersDetailsRepository: {},
            stateMachine,
            schemaValidator: { entry: sinon.stub() },
            usersSchemas: { postAuthenticateEmail: { query: {} } },
            logger,
        } as any);

        await verifyEmailCodeMiddleware.verify(request, response, next);

        expect(usersRepository.findOne).to.have.been.calledWith({ email: 'test@email.com' });
        expect(response.locals.userStatus).to.equal(InProgressStatusEnum.enum.DONE);
        expect(next).to.have.been.calledOnce();
    });

    it('should throw when neither id nor email is provided', async () => {
        const request = {
            params: {},
            query: { code: 'KLI44', flow: 'create-user' },
        } as unknown as Request;
        const response = {} as Response;
        const next = sinon.spy() as unknown as NextFunction;

        usersRepository = {
            findOne: sinon.stub(),
        };

        verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
            usersRepository,
            usersDetailsRepository: {},
            stateMachine,
            schemaValidator: { entry: sinon.stub() },
            usersSchemas: { postAuthenticateEmail: { query: {} } },
            logger,
        } as any);

        try {
            await verifyEmailCodeMiddleware.verify(request, response, next);
            expect.fail('Expected missing identifier error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.be.equal('Neither id or email was provided to validate the email code');
            expect(err.name).to.be.equal('BadRequest');
            expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
        }
    });

    it('should throw when the user status is not allowed for email code verification', async () => {
        const request = {
            params: { id: '123' },
            query: { code: 'KLI44', flow: 'create-user' },
        } as unknown as Request;
        const response = {} as Response;
        const next = sinon.spy() as unknown as NextFunction;

        usersRepository = {
            findOne: sinon.stub().returns({
                userId: '123',
                inProgress: {
                    status: InProgressStatusEnum.enum.WAIT_TO_DELETE_USER,
                    code: 'KLI44',
                },
                twoFactorSecret: { active: true },
            }),
        };

        verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
            usersRepository,
            usersDetailsRepository: {},
            stateMachine,
            schemaValidator: { entry: sinon.stub() },
            usersSchemas: { postAuthenticateEmail: { query: {} } },
            logger,
        } as any);

        try {
            await verifyEmailCodeMiddleware.verify(request, response, next);
            expect.fail('Expected invalid status error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.be.equal('User status is invalid to perform this operation');
            expect(err.name).to.be.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
            expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
        }
    });

    it('should throw when the target user does not exist', async () => {
        const request = {
            params: { id: '123' },
            query: { code: 'KLI44', flow: 'create-user' },
        } as unknown as Request;
        const response = {} as Response;
        const next = sinon.spy() as unknown as NextFunction;

        usersRepository = {
            findOne: sinon.stub().returns(null),
        };

        verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
            usersRepository,
            usersDetailsRepository: {},
            stateMachine,
            schemaValidator: { entry: sinon.stub() },
            usersSchemas: { postAuthenticateEmail: { query: {} } },
            logger,
        } as any);

        try {
            await verifyEmailCodeMiddleware.verify(request, response, next);
            expect.fail('Expected missing user error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.be.equal('User does not exist');
            expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
            expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
        }
    });

    it('should prefer email lookup when both id and email are present', async () => {
        const request = {
            params: { id: '123' },
            query: { email: 'test@email.com', code: 'KLI44', flow: 'create-user' },
        } as unknown as Request;
        const response = { locals: {} } as Response;
        const next = sinon.spy() as unknown as NextFunction;

        usersRepository = {
            findOne: sinon
                .stub()
                .onFirstCall()
                .returns({
                    userId: '123',
                    inProgress: {
                        status: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
                        code: 'OTHER',
                    },
                    twoFactorSecret: { active: true },
                })
                .onSecondCall()
                .returns({
                    userId: '456',
                    inProgress: {
                        status: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
                        code: 'KLI44',
                    },
                    twoFactorSecret: { active: true },
                    updatedAt: '2024-12-12T00:00:00.000Z',
                }),
        };

        stateMachine.machine.returns({
            userId: '456',
            inProgress: { status: InProgressStatusEnum.enum.DONE },
            twoFactorSecret: { active: true },
            updatedAt: '2024-12-12T00:00:00.000Z',
        });

        verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
            usersRepository,
            usersDetailsRepository: {},
            stateMachine,
            schemaValidator: { entry: sinon.stub() },
            usersSchemas: { postAuthenticateEmail: { query: {} } },
            logger,
        } as any);

        await verifyEmailCodeMiddleware.verify(request, response, next);

        expect(usersRepository.findOne.firstCall).to.have.been.calledWith({ userId: '123' });
        expect(usersRepository.findOne.secondCall).to.have.been.calledWith({ email: 'test@email.com' });
        expect(response.locals.userId).to.equal('456');
        expect(next).to.have.been.calledOnce();
    });
});
