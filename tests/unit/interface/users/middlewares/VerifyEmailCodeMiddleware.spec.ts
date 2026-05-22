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
});
