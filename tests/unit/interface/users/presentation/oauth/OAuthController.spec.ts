/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import OAuthController from 'src/interface/users/presentation/oauth/OAuthController';

describe('Interface :: Users :: Presentation :: Oauth :: OAuthController', () => {
    let oauthController: OAuthController,
        googleOperation: any,
        facebookOperation: any,
        discordOperation: any,
        completeUserOperation: any;

    context('#google', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            googleOperation = { execute: sinon.spy(() => ({})) };
            facebookOperation = { execute: () => ({}) };
            discordOperation = { execute: () => ({}) };
            completeUserOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation,
                completeUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.user = { email: 'test@email.com' };
            await oauthController.google(request, response);

            expect(googleOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });

        it('should correctly call the methods and functions - when login', async () => {
            request.user = { email: 'test@email.com' };
            googleOperation = { execute: sinon.spy(() => '123') };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation,
                completeUserOperation,
            });

            await oauthController.google(request, response);

            expect(googleOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.calledWith({ token: '123' });
        });

        it('should correctly call the methods and functions - when login - register', async () => {
            request.user = { email: 'test@email.com' };
            googleOperation = { execute: sinon.spy(() => ({ providerId: '123' })) };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation,
                completeUserOperation,
            });

            await oauthController.google(request, response);

            expect(googleOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.calledWith({ providerId: '123' });
        });
    });

    context('#facebook', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            googleOperation = { execute: () => ({}) };
            facebookOperation = { execute: sinon.spy(() => ({})) };
            discordOperation = { execute: () => ({}) };
            completeUserOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation,
                completeUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.user = { email: 'test20@email.com' };
            await oauthController.facebook(request, response);

            expect(facebookOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });

        it('should correctly call the methods and functions - when login', async () => {
            request.user = { email: 'test20@email.com' };
            facebookOperation = { execute: sinon.spy(() => '123') };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation,
                completeUserOperation,
            });

            await oauthController.facebook(request, response);

            expect(facebookOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.calledWith({ token: '123' });
        });

        it('should correctly call the methods and functions - when login - register', async () => {
            request.user = { email: 'test@email.com' };
            facebookOperation = { execute: sinon.spy(() => ({ providerId: '123' })) };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation,
                completeUserOperation,
            });

            await oauthController.facebook(request, response);

            expect(facebookOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.calledWith({ providerId: '123' });
        });
    });

    context('#discord', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);
            response.end = sinon.spy(() => response);

            googleOperation = { execute: () => ({}) };
            facebookOperation = { execute: () => ({}) };
            discordOperation = { execute: sinon.spy(() => ({})) };
            completeUserOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation,
                completeUserOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.user = { email: 'test20@email.com' };
            discordOperation = { execute: sinon.spy(() => '123') };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation,
                completeUserOperation,
            });

            await oauthController.discord(request, response);

            expect(discordOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.calledWith({ token: '123' });
        });

        it('should correctly call the methods and functions - when login', async () => {
            request.user = { email: 'test20@email.com' };
            discordOperation = { execute: sinon.spy(() => '123') };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation,
                completeUserOperation,
            });

            await oauthController.discord(request, response);

            expect(discordOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.calledWith({ token: '123' });
        });

        it('should correctly call the methods and functions - when login - register', async () => {
            request.user = { email: 'test@email.com' };
            discordOperation = { execute: sinon.spy(() => ({ providerId: '123' })) };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation,
                completeUserOperation,
            });

            await oauthController.discord(request, response);

            expect(discordOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.calledWith({ providerId: '123' });
        });
    });

    context('#completeUser', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            googleOperation = { execute: () => ({}) };
            facebookOperation = { execute: () => ({}) };
            discordOperation = { execute: () => ({}) };
            completeUserOperation = { execute: sinon.spy(() => ({})) };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation,
                completeUserOperation,
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
