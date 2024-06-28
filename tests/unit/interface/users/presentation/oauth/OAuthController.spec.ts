/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import OAuthController from 'src/interface/users/presentation/oauth/OAuthController';

describe('Interface :: Users :: Presentation :: Oauth :: OAuthController', () => {
    let oauthController: OAuthController,
        googleOperation: any,
        discordOperation: any,
        loginUserOperation: any,
        completeUserOperation: any;

    context('#google', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);
            response.cookie = sinon.spy(() => response);

            googleOperation = { execute: sinon.spy(() => ({})) };
            discordOperation = { execute: () => ({}) };
            loginUserOperation = { execute: () => ({}) };
            completeUserOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                discordOperation,
                completeUserOperation,
                loginUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.user = { email: 'test@email.com' };
            await oauthController.google(request, response);

            expect(googleOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });

        it('should correctly call the methods and functions - when login', async () => {
            request.user = { email: 'test@email.com' };
            googleOperation = { execute: sinon.spy(() => '123') };
            loginUserOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                discordOperation,
                completeUserOperation,
                loginUserOperation,
            });

            await oauthController.google(request, response);

            expect(googleOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });

        it('should correctly call the methods and functions - when login - register', async () => {
            request.user = { email: 'test@email.com' };
            googleOperation = { execute: sinon.spy(() => ({ providerId: '123' })) };
            loginUserOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                discordOperation,
                completeUserOperation,
                loginUserOperation,
            });

            await oauthController.google(request, response);

            expect(googleOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#discord', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);
            response.cookie = sinon.spy(() => response);
            response.end = sinon.spy(() => response);

            googleOperation = { execute: () => ({}) };
            discordOperation = { execute: sinon.spy(() => ({})) };
            loginUserOperation = { execute: () => ({}) };
            completeUserOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                discordOperation,
                completeUserOperation,
                loginUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.user = { email: 'test20@email.com' };
            discordOperation = { execute: sinon.spy(() => '123') };
            loginUserOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                discordOperation,
                completeUserOperation,
                loginUserOperation,
            });

            await oauthController.discord(request, response);

            expect(discordOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });

        it('should correctly call the methods and functions - when login', async () => {
            request.user = { email: 'test20@email.com' };
            discordOperation = { execute: sinon.spy(() => '123') };
            loginUserOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                discordOperation,
                completeUserOperation,
                loginUserOperation,
            });

            await oauthController.discord(request, response);

            expect(discordOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });

        it('should correctly call the methods and functions - when login - register', async () => {
            request.user = { email: 'test@email.com' };
            discordOperation = { execute: sinon.spy(() => ({ providerId: '123' })) };
            loginUserOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                discordOperation,
                completeUserOperation,
                loginUserOperation,
            });

            await oauthController.discord(request, response);

            expect(discordOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#completeUser', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);
            response.cookie = sinon.spy(() => response);

            googleOperation = { execute: () => ({}) };
            discordOperation = { execute: () => ({}) };
            loginUserOperation = { execute: () => ({}) };
            completeUserOperation = { execute: sinon.spy(() => ({})) };

            oauthController = new OAuthController({
                googleOperation,
                discordOperation,
                completeUserOperation,
                loginUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { isReset: 'false' };
            request.body = {};
            await oauthController.complete(request, response);

            expect(completeUserOperation.execute).to.have.been.calledWith({
                userId: request.params.id,
                payload: request.body,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
