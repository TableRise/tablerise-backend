import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UsersController from 'src/interface/users/presentation/users/UsersController';

describe('Interface :: Users :: Presentation :: Users :: UsersController', () => {
    const buildResponse = (): any => ({
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
        end: sinon.stub().returnsThis(),
        cookie: sinon.stub().returnsThis(),
        clearCookie: sinon.stub().returnsThis(),
    });

    const buildController = () =>
        new UsersController({
            createUserOperation: { execute: sinon.stub() },
            updateUserOperation: { execute: sinon.stub().returns({ password: 'secret', nickname: 'nick' }) },
            updateUserDetailsOperation: { execute: sinon.stub().returns({ firstName: 'Joe' }) },
            verifyEmailOperation: { execute: sinon.stub() },
            getUsersOperation: { execute: sinon.stub().returns([]) },
            getUserByIdOperation: { execute: sinon.stub().returns({ password: 'secret' }) },
            getUserByNicknameAndTagOperation: { execute: sinon.stub().returns({ password: 'secret' }) },
            activateTwoFactorOperation: { execute: sinon.stub().returns({ active: true, qrcode: 'qr' }) },
            deactivateTwoFactorOperation: { execute: sinon.stub() },
            updateEmailOperation: { execute: sinon.stub() },
            updatePasswordOperation: { execute: sinon.stub() },
            addCampaignNoteOperation: { execute: sinon.stub() },
            pictureProfileOperation: { execute: sinon.stub().returns({ password: 'secret' }) },
            postSupportEmailOperation: { execute: sinon.stub() },
            registerDonationOperation: { execute: sinon.stub() },
            updateUserCoverOperation: { execute: sinon.stub() },
            removeUserCoverOperation: { execute: sinon.stub() },
            deleteUserOperation: { execute: sinon.stub() },
            logoutUserOperation: { execute: sinon.stub() },
            loginUserOperation: {
                execute: sinon.stub().returns({ tokenData: { userId: '123' }, cookieOptions: {} }),
            },
            getCampaignsByUserIdOperation: { execute: sinon.stub().returns([]) },
        } as any);

    it('should update user without exposing password', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.updateUser({ params: { id: '123' }, body: { nickname: 'newNick' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith({ nickname: 'nick' });
    });

    it('should update user details', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.updateUserDetails({ params: { id: '123' }, body: { firstName: 'Joe' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith({ firstName: 'Joe' });
    });

    it('should return the 2FA activation payload', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.activateTwoFactor({ params: { id: '123' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith({ active: true, qrcode: 'qr' });
    });

    it('should deactivate 2FA without returning a body', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.deactivateTwoFactor({ params: { id: '123' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });

    it('should register a user without exposing password', async () => {
        const controller = buildController();
        const response = buildResponse();
        (controller as any).createUserOperation.execute.resolves({ userId: '123', password: 'secret' });

        await controller.register({ body: { email: 'mail@test.com' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
        expect(response.json).to.have.been.calledWith({ userId: '123' });
    });

    it('should return locals for internal authentication', async () => {
        const controller = buildController();
        const response = buildResponse();
        response.locals = { userId: '123' };

        await controller.internalAuthentication({} as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith({ userId: '123' });
    });

    it('should return campaigns by user id', async () => {
        const controller = buildController();
        const response = buildResponse();
        (controller as any).getCampaignsByUserIdOperation.execute.returns([{ campaignId: 'campaign-1' }]);

        await controller.getCampaignsByUserId({ params: { id: '123' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith([{ campaignId: 'campaign-1' }]);
    });

    it('should verify email and return no content', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.verifyEmail({ query: { email: 'mail@test.com', code: '1234' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });

    it('should list users without passwords', async () => {
        const controller = buildController();
        const response = buildResponse();
        (controller as any).getUsersOperation.execute.returns([
            { userId: '123', password: 'secret' },
            { userId: '456', password: 'hidden' },
        ]);

        await controller.getUsers({} as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith([{ userId: '123' }, { userId: '456' }]);
    });

    it('should return the current authenticated user without password', async () => {
        const controller = buildController();
        const response = buildResponse();
        (controller as any).getUserByIdOperation.execute.returns({ userId: '123', password: 'secret' });

        await controller.currentUser({ user: { userId: '123' } } as any, response);

        expect((controller as any).getUserByIdOperation.execute).to.have.been.calledWith({ userId: '123' });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith({ userId: '123' });
    });

    it('should get a user by nickname and tag without password', async () => {
        const controller = buildController();
        const response = buildResponse();
        (controller as any).getUserByNicknameAndTagOperation.execute.returns({ userId: '123', password: 'secret' });

        await controller.getUserByNicknameAndTag({ query: { nickname: 'joe_the_great#9999' } } as any, response);

        expect((controller as any).getUserByNicknameAndTagOperation.execute).to.have.been.calledWith({
            nickname: 'joe_the_great',
            tag: '#9999',
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith({ userId: '123' });
    });

    it('should get a user by id without password', async () => {
        const controller = buildController();
        const response = buildResponse();
        (controller as any).getUserByIdOperation.execute.returns({ userId: '123', password: 'secret' });

        await controller.getUserById({ params: { id: '123' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith({ userId: '123' });
    });

    it('should login and set the token cookie', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.login({ user: { token: 'jwt-token' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.cookie).to.have.been.calledWith('token', 'jwt-token', {});
        expect(response.json).to.have.been.calledWith({ userId: '123' });
    });

    it('should update email and return no content', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.updateEmail({ params: { id: '123' }, body: { email: 'new@mail.com' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });

    it('should update password and return no content', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.updatePassword({ body: { password: 'new-secret' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });

    it('should update the profile picture without exposing password', async () => {
        const controller = buildController();
        const response = buildResponse();
        (controller as any).pictureProfileOperation.execute.returns({ userId: '123', password: 'secret' });

        await controller.profilePicture({ params: { id: '123' }, file: { name: 'file' } } as any, response);

        expect((controller as any).pictureProfileOperation.execute).to.have.been.calledWith({
            userId: '123',
            image: { name: 'file' },
            imageObject: undefined,
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith({ userId: '123' });
    });

    it('should forward a provided profile imageObject without needing a file', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.profilePicture(
            {
                params: { id: '123' },
                body: {
                    imageObject: JSON.stringify({
                        id: 'image-1',
                        link: 'https://img.bb/profile',
                        uploadDate: '2026-06-06T00:00:00.000Z',
                        deleteUrl: '',
                        request: { success: true, status: 200 },
                    }),
                },
            } as any,
            response
        );

        expect((controller as any).pictureProfileOperation.execute).to.have.been.calledWith({
            userId: '123',
            image: undefined,
            imageObject: {
                id: 'image-1',
                link: 'https://img.bb/profile',
                uploadDate: '2026-06-06T00:00:00.000Z',
                deleteUrl: '',
                request: { success: true, status: 200 },
            },
        });
    });

    it('should update the user cover and return no content', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.updateUserCover(
            {
                params: { id: '123' },
                user: { userId: '123' },
                file: { originalname: 'cover.png' },
            } as any,
            response
        );

        expect((controller as any).updateUserCoverOperation.execute).to.have.been.calledWith({
            userId: '123',
            image: { originalname: 'cover.png' },
            imageObject: undefined,
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });

    it('should forward a provided cover imageObject without needing a file', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.updateUserCover(
            {
                params: { id: '123' },
                user: { userId: '123' },
                body: {
                    imageObject: JSON.stringify({
                        id: 'cover-1',
                        link: 'https://img.bb/cover',
                        uploadDate: '2026-06-06T00:00:00.000Z',
                        deleteUrl: '',
                        request: { success: true, status: 200 },
                    }),
                },
            } as any,
            response
        );

        expect((controller as any).updateUserCoverOperation.execute).to.have.been.calledWith({
            userId: '123',
            image: undefined,
            imageObject: {
                id: 'cover-1',
                link: 'https://img.bb/cover',
                uploadDate: '2026-06-06T00:00:00.000Z',
                deleteUrl: '',
                request: { success: true, status: 200 },
            },
        });
    });

    it('should remove the user cover and return no content', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.removeUserCover(
            {
                params: { id: '123' },
                user: { userId: '123' },
            } as any,
            response
        );

        expect((controller as any).removeUserCoverOperation.execute).to.have.been.calledWith({
            userId: '123',
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });

    it('should reject user cover update requests for a different authenticated user', async () => {
        const controller = buildController();
        const response = buildResponse();

        let thrownError;

        try {
            await controller.updateUserCover(
                {
                    params: { id: '123' },
                    user: { userId: '456' },
                    file: { originalname: 'cover.png' },
                } as any,
                response
            );
        } catch (error) {
            thrownError = error;
        }

        const err = thrownError as HttpRequestErrors;
        expect(err.message).to.equal('Unauthorized');
        expect(err.code).to.equal(HttpStatusCode.UNAUTHORIZED);
        expect((controller as any).updateUserCoverOperation.execute).to.not.have.been.called();
        expect(response.status).to.not.have.been.called();
    });

    it('should reject user cover removal requests for a different authenticated user', async () => {
        const controller = buildController();
        const response = buildResponse();

        let thrownError;

        try {
            await controller.removeUserCover(
                {
                    params: { id: '123' },
                    user: { userId: '456' },
                } as any,
                response
            );
        } catch (error) {
            thrownError = error;
        }

        const err = thrownError as HttpRequestErrors;
        expect(err.message).to.equal('Unauthorized');
        expect(err.code).to.equal(HttpStatusCode.UNAUTHORIZED);
        expect((controller as any).removeUserCoverOperation.execute).to.not.have.been.called();
        expect(response.status).to.not.have.been.called();
    });

    it('should update campaign notes', async () => {
        const controller = buildController();
        const response = buildResponse();
        (controller as any).addCampaignNoteOperation.execute.returns({ title: 'note', content: 'updated' });

        await controller.updateCampaignNotes(
            {
                params: { id: '123' },
                query: { campaignId: 'campaign-1' },
                body: { title: 'note', content: 'updated' },
            } as any,
            response
        );

        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith({ title: 'note', content: 'updated' });
    });

    it('should post a support email and return no content', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.postSupportEmail(
            {
                params: { id: '123' },
                user: { userId: '123' },
                body: {
                    title: 'Nao consigo entrar',
                    content: 'Meu codigo nao chega.',
                    category: 'Autenticacao',
                    campaignCode: 'ABC123',
                },
            } as any,
            response
        );

        expect((controller as any).postSupportEmailOperation.execute).to.have.been.calledWith({
            userId: '123',
            payload: {
                title: 'Nao consigo entrar',
                content: 'Meu codigo nao chega.',
                category: 'Autenticacao',
                campaignCode: 'ABC123',
            },
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });

    it('should reject support email requests for a different authenticated user', async () => {
        const controller = buildController();
        const response = buildResponse();

        let thrownError;

        try {
            await controller.postSupportEmail(
                {
                    params: { id: '123' },
                    user: { userId: '456' },
                    body: {
                        title: 'Nao consigo entrar',
                        content: 'Meu codigo nao chega.',
                        category: 'Autenticacao',
                    },
                } as any,
                response
            );
        } catch (error) {
            thrownError = error;
        }

        const err = thrownError as HttpRequestErrors;
        expect(err.message).to.equal('Unauthorized');
        expect(err.code).to.equal(HttpStatusCode.UNAUTHORIZED);
        expect((controller as any).postSupportEmailOperation.execute).to.not.have.been.called();
        expect(response.status).to.not.have.been.called();
    });

    it('should register a donation and return no content', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.registerDonation(
            {
                params: { id: '12cd093b-0a8a-42fe-910f-001f2ab28454' },
                user: { userId: '12cd093b-0a8a-42fe-910f-001f2ab28454' },
                query: { validation: 'false' },
                body: {
                    value: 15,
                    timestamp: '2026-06-03T12:30:00.000Z',
                    userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                },
            } as any,
            response
        );

        expect((controller as any).registerDonationOperation.execute).to.have.been.calledWith({
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            validation: false,
            payload: {
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            },
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });

    it('should normalize string true in donation validation queries', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.registerDonation(
            {
                params: { id: '12cd093b-0a8a-42fe-910f-001f2ab28454' },
                user: { userId: '12cd093b-0a8a-42fe-910f-001f2ab28454' },
                query: { validation: 'true' },
                body: {
                    value: 15,
                    timestamp: '2026-06-03T12:30:00.000Z',
                    nickname: 'Lia',
                    userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                },
            } as any,
            response
        );

        expect((controller as any).registerDonationOperation.execute).to.have.been.calledWith({
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            validation: true,
            payload: {
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                nickname: 'Lia',
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            },
        });
    });

    it('should reject donation requests for a different authenticated user', async () => {
        const controller = buildController();
        const response = buildResponse();

        let thrownError;

        try {
            await controller.registerDonation(
                {
                    params: { id: '123' },
                    user: { userId: '456' },
                    query: { validation: true },
                    body: {
                        value: 15,
                        timestamp: '2026-06-03T12:30:00.000Z',
                        nickname: 'Lia',
                        userId: '123',
                    },
                } as any,
                response
            );
        } catch (error) {
            thrownError = error;
        }

        const err = thrownError as HttpRequestErrors;
        expect(err.message).to.equal('Unauthorized');
        expect(err.code).to.equal(HttpStatusCode.UNAUTHORIZED);
        expect((controller as any).registerDonationOperation.execute).to.not.have.been.called();
        expect(response.status).to.not.have.been.called();
    });

    it('should fallback boolean query normalization for unknown values', () => {
        const controller = buildController() as any;

        expect(controller.normalizeBooleanQuery(undefined)).to.equal(false);
        expect(controller.normalizeBooleanQuery(1)).to.equal(true);
    });

    it('should logout and clear auth cookies', async () => {
        const controller = buildController();
        const response = buildResponse();
        const previousNodeEnv = process.env.NODE_ENV;
        const previousDomainCookie = process.env.DOMAIN_COOKIE;

        process.env.NODE_ENV = 'production';
        process.env.DOMAIN_COOKIE = 'example.com';

        try {
            await controller.logoutUser({ token: 'jwt-token' } as any, response);

            expect(response.clearCookie).to.have.been.calledWith('token', {
                httpOnly: true,
                secure: true,
                domain: 'example.com',
                sameSite: 'none',
                path: '/',
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
            expect(response.end).to.have.been.called();
        } finally {
            process.env.NODE_ENV = previousNodeEnv;
            process.env.DOMAIN_COOKIE = previousDomainCookie;
        }
    });

    it('should delete the user and return no content', async () => {
        const controller = buildController();
        const response = buildResponse();

        await controller.delete({ params: { id: '123' } } as any, response);

        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });
});
