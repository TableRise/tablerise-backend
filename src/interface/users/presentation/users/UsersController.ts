import { Response, Request } from 'express';
import {
    RegisterUserPayload,
    UpdateGameInfoPayload,
    VerifyEmailPayload,
} from 'src/types/api/users/http/payload';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserSecretQuestion } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { FileObject } from 'src/types/shared/file';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class UsersController {
    private readonly _createUserOperation;
    private readonly _updateUserOperation;
    private readonly _verifyEmailOperation;
    private readonly _getUsersOperation;
    private readonly _getUserByIdOperation;
    private readonly _confirmEmailOperation;
    private readonly _activateSecretQuestionOperation;
    private readonly _activateTwoFactorOperation;
    private readonly _updateEmailOperation;
    private readonly _updatePasswordOperation;
    private readonly _updateGameInfoOperation;
    private readonly _resetProfileOperation;
    private readonly _pictureProfileOperation;
    private readonly _deleteUserOperation;
    private readonly _logoutUserOperation;

    constructor({
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
        logoutUserOperation,
    }: InterfaceDependencies['usersControllerContract']) {
        this._createUserOperation = createUserOperation;
        this._updateUserOperation = updateUserOperation;
        this._verifyEmailOperation = verifyEmailOperation;
        this._getUsersOperation = getUsersOperation;
        this._getUserByIdOperation = getUserByIdOperation;
        this._confirmEmailOperation = confirmEmailOperation;
        this._activateSecretQuestionOperation = activateSecretQuestionOperation;
        this._activateTwoFactorOperation = activateTwoFactorOperation;
        this._updateEmailOperation = updateEmailOperation;
        this._updatePasswordOperation = updatePasswordOperation;
        this._updateGameInfoOperation = updateGameInfoOperation;
        this._resetProfileOperation = resetProfileOperation;
        this._pictureProfileOperation = pictureProfileOperation;
        this._deleteUserOperation = deleteUserOperation;
        this._logoutUserOperation = logoutUserOperation;

        this.register = this.register.bind(this);
        this.update = this.update.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.activateSecretQuestion = this.activateSecretQuestion.bind(this);
        this.confirmEmail = this.confirmEmail.bind(this);
        this.activateTwoFactor = this.activateTwoFactor.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.updateGameInfo = this.updateGameInfo.bind(this);
        this.resetProfile = this.resetProfile.bind(this);
        this.profilePicture = this.profilePicture.bind(this);
        this.delete = this.delete.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
    }

    public async register(req: Request, res: Response): Promise<Response> {
        const payload = req.body as RegisterUserPayload;

        const result = await this._createUserOperation.execute(payload);
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body as RegisterUserPayload;

        const result = await this._updateUserOperation.execute({ userId: id, payload });
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async verifyEmail(req: Request, res: Response): Promise<Response> {
        const { email, newEmail } = req.query as unknown as VerifyEmailPayload;

        await this._verifyEmailOperation.execute({ email, newEmail });
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async getUsers(req: Request, res: Response): Promise<Response> {
        const result = await this._getUsersOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getUserById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getUserByIdOperation.execute({ userId: id });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async login(req: Request, res: Response): Promise<Response> {
        const { user: token } = req;
        return res
            .status(HttpStatusCode.OK)
            .cookie('token', token, {
                maxAge: 3600000,
                httpOnly: true,
                secure: Boolean(process.env.COOKIE_SECURE),
            })
            .end();
    }

    public async activateSecretQuestion(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { isUpdate } = req.query;
        const payload = req.body as UserSecretQuestion;

        await this._activateSecretQuestionOperation.execute(
            { userId: id, payload },
            isUpdate === 'true'
        );

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async confirmEmail(req: Request, res: Response): Promise<Response> {
        const { email, code } = req.query as { email: string; code: string };

        const result = await this._confirmEmailOperation.execute({ email, code });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async activateTwoFactor(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { isReset } = req.query;

        const result = await this._activateTwoFactorOperation.execute(
            id,
            isReset === 'true'
        );
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateEmail(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { code } = req.query as { code: string };
        const { email } = req.body;

        await this._updateEmailOperation.execute({ userId: id, code, email });
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async updatePassword(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { code } = req.query as { code: string };
        const { password } = req.body;

        await this._updatePasswordOperation.execute({ userId: id, code, password });
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async profilePicture(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const result = await this._pictureProfileOperation.execute({
            userId: id,
            image: req.file as FileObject,
        });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateGameInfo(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { infoId, targetInfo, operation } =
            req.query as unknown as UpdateGameInfoPayload;

        const result = await this._updateGameInfoOperation.execute({
            userId: id,
            infoId,
            targetInfo,
            operation,
        });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async resetProfile(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this._resetProfileOperation.execute(id);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async logoutUser(req: Request, res: Response): Promise<Response> {
        await this._logoutUserOperation.execute(req.token as string);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this._deleteUserOperation.execute(id);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }
}
