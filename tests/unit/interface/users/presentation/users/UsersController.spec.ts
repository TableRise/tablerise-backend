/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import UsersController from 'src/interface/users/presentation/users/UsersController';

describe('Interface :: Users :: Presentation :: Users :: UsersController', () => {
    let usersController: UsersController,
        createUserOperation: any,
        updateUserOperation: any,
        verifyEmailOperation: any,
        getUsersOperation: any,
        getUserByIdOperation: any,
        confirmCodeOperation: any,
        activateSecretQuestionOperation: any,
        activateTwoFactorOperation: any,
        resetTwoFactorOperation: any,
        updateEmailOperation: any,
        updatePasswordOperation: any,
        updateGameInfoOperation: any,
        resetProfileOperation: any,
        deleteUserOperation: any;

    context('#register', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createUserOperation = { execute: sinon.spy(() => ({})) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.body = { email: 'test@email.com' };
            await usersController.register(request, response);

            expect(createUserOperation.execute).to.have.been.calledWith(request.body);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });
    });

    context('#update', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: sinon.spy(() => ({})) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.body = { email: 'test20@email.com' };
            await usersController.update(request, response);

            expect(updateUserOperation.execute).to.have.been.calledWith({
                userId: request.params.id,
                payload: request.body,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });
    });

    context('#verifyEmail', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);
            response.end = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: sinon.spy(() => ({})) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.query = { email: 'test20@email.com', newEmail: 'test30@email.com' };
            await usersController.verifyEmail(request, response);

            expect(verifyEmailOperation.execute).to.have.been.calledWith(request.query);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
            expect(response.json).to.have.not.been.called();
            expect(response.end).to.have.been.called();
        });
    });

    context('#getUsers', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: sinon.spy(() => ({})) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await usersController.getUsers(request, response);

            expect(getUsersOperation.execute).to.have.been.called();
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#getUserById', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: sinon.spy(() => ({})) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await usersController.getUserById(request, response);

            expect(getUserByIdOperation.execute).to.have.been.calledWith({
                userId: request.params.id,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#login', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.user = { token: '123' };
            await usersController.login(request, response);

            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#confirmCode', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: sinon.spy(() => ({})) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { code: '123' };
            await usersController.confirmCode(request, response);

            expect(confirmCodeOperation.execute).to.have.been.calledWith({
                userId: request.params.id,
                code: request.query.code,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#activateTwoFactor', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: sinon.spy(() => ({})) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await usersController.activateTwoFactor(request, response);

            expect(activateTwoFactorOperation.execute).to.have.been.calledWith(
                request.params.id
            );
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#resetTwoFactor', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: sinon.spy(() => ({})) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { code: '123' };
            await usersController.resetTwoFactor(request, response);

            expect(resetTwoFactorOperation.execute).to.have.been.calledWith({
                userId: request.params.id,
                code: request.query.code,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#updateEmail', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);
            response.end = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: sinon.spy(() => ({})) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { code: '123' };
            request.body = { email: 'test@email.com' };
            await usersController.updateEmail(request, response);

            expect(updateEmailOperation.execute).to.have.been.calledWith({
                userId: request.params.id,
                code: request.query.code,
                email: request.body.email,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.not.been.called();
            expect(response.end).to.have.been.called();
        });
    });

    context('#updateGameInfo', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: sinon.spy(() => ({})) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { infoId: '123', targetInfo: 'badges', operation: 'add' };
            await usersController.updateGameInfo(request, response);

            expect(updateGameInfoOperation.execute).to.have.been.calledWith({
                userId: request.params.id,
                ...request.query,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#resetProfile', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);
            response.end = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: sinon.spy(() => ({})) };
            deleteUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await usersController.resetProfile(request, response);

            expect(resetProfileOperation.execute).to.have.been.calledWith(
                request.params.id
            );
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
            expect(response.json).to.have.not.been.called();
            expect(response.end).to.have.been.called();
        });
    });

    context('#delete', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);
            response.end = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };
            updateUserOperation = { execute: () => ({}) };
            verifyEmailOperation = { execute: () => ({}) };
            getUsersOperation = { execute: () => ({}) };
            getUserByIdOperation = { execute: () => ({}) };
            confirmCodeOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            resetTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: sinon.spy(() => ({})) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmCodeOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                resetTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                deleteUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await usersController.delete(request, response);

            expect(deleteUserOperation.execute).to.have.been.calledWith(
                request.params.id
            );
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
            expect(response.json).to.have.not.been.called();
            expect(response.end).to.have.been.called();
        });
    });
});
