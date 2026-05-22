import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
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
            activateTwoFactorOperation: { execute: sinon.stub().returns({ active: true, qrcode: 'qr' }) },
            deactivateTwoFactorOperation: { execute: sinon.stub() },
            resetTwoFactorOperation: { execute: sinon.stub().returns({ active: true, qrcode: 'qr' }) },
            updateEmailOperation: { execute: sinon.stub() },
            updatePasswordOperation: { execute: sinon.stub() },
            updateGameInfoOperation: { add: sinon.stub(), remove: sinon.stub() },
            addCampaignNoteOperation: { execute: sinon.stub() },
            resetProfileOperation: { execute: sinon.stub() },
            pictureProfileOperation: { execute: sinon.stub().returns({ password: 'secret' }) },
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
});
