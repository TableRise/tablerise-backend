/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import UsersController from 'src/interface/users/presentation/users/UsersController';
import { Readable } from 'stream';

describe('Interface :: Users :: Presentation :: Users :: UsersController', () => {
    let usersController: UsersController,
        createUserOperation: any,
        updateUserOperation: any,
        verifyEmailOperation: any,
        getUsersOperation: any,
        getUserByIdOperation: any,
        confirmEmailOperation: any,
        activateSecretQuestionOperation: any,
        activateTwoFactorOperation: any,
        updateEmailOperation: any,
        updatePasswordOperation: any,
        updateGameInfoOperation: any,
        resetProfileOperation: any,
        pictureProfileOperation: any,
        deleteUserOperation: any,
        logoutUserOperation: any;

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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
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
            confirmEmailOperation = { execute: sinon.spy(() => ({})) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.query = { email: 'test@email.com', code: '123' };
            await usersController.confirmEmail(request, response);

            expect(confirmEmailOperation.execute).to.have.been.calledWith({
                email: request.query.email,
                code: request.query.code,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#activateSecretQuestion', () => {
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: sinon.spy(() => ({})) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { isUpdate: 'false' };
            request.body = {};
            await usersController.activateSecretQuestion(request, response);

            expect(activateSecretQuestionOperation.execute).to.have.been.calledWith(
                { userId: request.params.id, payload: request.body },
                false
            );
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
            expect(response.json).to.not.have.been.called();
            expect(response.end).to.have.been.called();
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: sinon.spy(() => ({})) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { isReset: 'false' };
            await usersController.activateTwoFactor(request, response);

            expect(activateTwoFactorOperation.execute).to.have.been.calledWith(
                request.params.id,
                false
            );
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: sinon.spy(() => ({})) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
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
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
            expect(response.json).to.have.not.been.called();
            expect(response.end).to.have.been.called();
        });
    });

    context('#updatePassword', () => {
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: sinon.spy(() => ({})) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { code: '123' };
            request.body = { password: '321' };
            await usersController.updatePassword(request, response);

            expect(updatePasswordOperation.execute).to.have.been.calledWith({
                userId: request.params.id,
                code: request.query.code,
                password: request.body.password,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: sinon.spy(() => ({})) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: sinon.spy(() => ({})) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
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

    context('#profilePicture', () => {
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: sinon.spy(() => ({})) };
            deleteUserOperation = { execute: () => ({}) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.file = {
                fieldname: '',
                originalname: '',
                encoding: '',
                mimetype: '',
                size: 0,
                stream: '' as unknown as Readable,
                destination: '',
                path: '',
                filename: '',
                buffer: Buffer.alloc(10),
            };
            await usersController.profilePicture(request, response);

            expect(pictureProfileOperation.execute).to.have.been.calledWith({
                userId: request.params.id,
                image: request.file,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
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
            confirmEmailOperation = { execute: () => ({}) };
            activateSecretQuestionOperation = { execute: () => ({}) };
            activateTwoFactorOperation = { execute: () => ({}) };
            updateEmailOperation = { execute: () => ({}) };
            updatePasswordOperation = { execute: () => ({}) };
            updateGameInfoOperation = { execute: () => ({}) };
            resetProfileOperation = { execute: () => ({}) };
            pictureProfileOperation = { execute: () => ({}) };
            deleteUserOperation = { execute: sinon.spy(() => ({})) };
            logoutUserOperation = { execute: () => ({}) };

            usersController = new UsersController({
                createUserOperation,
                updateUserOperation,
                verifyEmailOperation,
                getUsersOperation,
                getUserByIdOperation,
                confirmEmailOperation,
                activateSecretQuestionOperation,
                activateTwoFactorOperation,
                updateEmailOperation,
                updatePasswordOperation,
                updateGameInfoOperation,
                resetProfileOperation,
                pictureProfileOperation,
                deleteUserOperation,
                logoutUserOperation
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
