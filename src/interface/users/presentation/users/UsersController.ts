import { Response, Request } from 'express';
import {
    RegisterUserPayload,
    UpdateGameInfoPayload,
    VerifyEmailPayload,
} from 'src/types/users/requests/Payload';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UsersControllerContract } from 'src/types/users/contracts/presentation/UsersController';
import { UserSecretQuestion } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { FileObject } from 'src/types/File';

export default class UsersController {
    private readonly _createUserOperation;
    private readonly _updateUserOperation;
    private readonly _verifyEmailOperation;
    private readonly _getUsersOperation;
    private readonly _getUserByIdOperation;
    private readonly _confirmCodeOperation;
    private readonly _activateSecretQuestionOperation;
    private readonly _activateTwoFactorOperation;
    private readonly _updateEmailOperation;
    private readonly _updatePasswordOperation;
    private readonly _updateGameInfoOperation;
    private readonly _resetProfileOperation;
    private readonly _pictureProfileOperation;
    private readonly _deleteUserOperation;

    constructor({
        createUserOperation,
        updateUserOperation,
        verifyEmailOperation,
        getUsersOperation,
        getUserByIdOperation,
        confirmCodeOperation,
        activateSecretQuestionOperation,
        activateTwoFactorOperation,
        updateEmailOperation,
        updatePasswordOperation,
        updateGameInfoOperation,
        resetProfileOperation,
        pictureProfileOperation,
        deleteUserOperation,
    }: UsersControllerContract) {
        this._createUserOperation = createUserOperation;
        this._updateUserOperation = updateUserOperation;
        this._verifyEmailOperation = verifyEmailOperation;
        this._getUsersOperation = getUsersOperation;
        this._getUserByIdOperation = getUserByIdOperation;
        this._confirmCodeOperation = confirmCodeOperation;
        this._activateSecretQuestionOperation = activateSecretQuestionOperation;
        this._activateTwoFactorOperation = activateTwoFactorOperation;
        this._updateEmailOperation = updateEmailOperation;
        this._updatePasswordOperation = updatePasswordOperation;
        this._updateGameInfoOperation = updateGameInfoOperation;
        this._resetProfileOperation = resetProfileOperation;
        this._pictureProfileOperation = pictureProfileOperation;
        this._deleteUserOperation = deleteUserOperation;

        this.register = this.register.bind(this);
        this.update = this.update.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.activateSecretQuestion = this.activateSecretQuestion.bind(this);
        this.confirmCode = this.confirmCode.bind(this);
        this.activateTwoFactor = this.activateTwoFactor.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.updateGameInfo = this.updateGameInfo.bind(this);
        this.resetProfile = this.resetProfile.bind(this);
        this.profilePicture = this.profilePicture.bind(this);
        this.delete = this.delete.bind(this);
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
        return res.status(HttpStatusCode.OK).json({ token });
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

    public async confirmCode(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { code } = req.query as { code: string };

        const result = await this._confirmCodeOperation.execute({ userId: id, code });
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

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this._deleteUserOperation.execute(id);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }
}
