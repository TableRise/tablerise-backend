import { Response, Request } from 'express';
import {
    RegisterUserPayload,
    UpdateGameInfoPayload,
    VerifyEmailPayload,
    UpdateSecretQuestion,
} from 'src/types/api/users/http/payload';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { FileObject } from 'src/types/shared/file';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import { TCreateUserBody } from './UsersSchemas';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';

export default class UsersController {
    private readonly createUserOperation;
    private readonly updateUserOperation;
    private readonly verifyEmailOperation;
    private readonly getUsersOperation;
    private readonly getUserByIdOperation;
    private readonly activateSecretQuestionOperation;
    private readonly updateSecretQuestionOperation;
    private readonly activateTwoFactorOperation;
    private readonly resetTwoFactorOperation;
    private readonly updateEmailOperation;
    private readonly updatePasswordOperation;
    private readonly updateGameInfoOperation;
    private readonly resetProfileOperation;
    private readonly pictureProfileOperation;
    private readonly deleteUserOperation;
    private readonly logoutUserOperation;
    private readonly loginUserOperation;
    private readonly getCampaignsByUserIdOperation;

    constructor({
        createUserOperation,
        updateUserOperation,
        verifyEmailOperation,
        getUsersOperation,
        getUserByIdOperation,
        activateSecretQuestionOperation,
        updateSecretQuestionOperation,
        activateTwoFactorOperation,
        resetTwoFactorOperation,
        updateEmailOperation,
        updatePasswordOperation,
        updateGameInfoOperation,
        resetProfileOperation,
        pictureProfileOperation,
        deleteUserOperation,
        logoutUserOperation,
        loginUserOperation,
        getCampaignsByUserIdOperation,
    }: InterfaceDependencies['usersControllerContract']) {
        this.createUserOperation = createUserOperation;
        this.updateUserOperation = updateUserOperation;
        this.verifyEmailOperation = verifyEmailOperation;
        this.getUsersOperation = getUsersOperation;
        this.getUserByIdOperation = getUserByIdOperation;
        this.activateSecretQuestionOperation = activateSecretQuestionOperation;
        this.updateSecretQuestionOperation = updateSecretQuestionOperation;
        this.activateTwoFactorOperation = activateTwoFactorOperation;
        this.resetTwoFactorOperation = resetTwoFactorOperation;
        this.updateEmailOperation = updateEmailOperation;
        this.updatePasswordOperation = updatePasswordOperation;
        this.updateGameInfoOperation = updateGameInfoOperation;
        this.resetProfileOperation = resetProfileOperation;
        this.pictureProfileOperation = pictureProfileOperation;
        this.deleteUserOperation = deleteUserOperation;
        this.logoutUserOperation = logoutUserOperation;
        this.loginUserOperation = loginUserOperation;
        this.getCampaignsByUserIdOperation = getCampaignsByUserIdOperation;

        this.register = this.register.bind(this);
        this.update = this.update.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.activateSecretQuestion = this.activateSecretQuestion.bind(this);
        this.updateSecretQuestion = this.updateSecretQuestion.bind(this);
        this.activateTwoFactor = this.activateTwoFactor.bind(this);
        this.resetTwoFactor = this.resetTwoFactor.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.updateGameInfo = this.updateGameInfo.bind(this);
        this.resetProfile = this.resetProfile.bind(this);
        this.profilePicture = this.profilePicture.bind(this);
        this.delete = this.delete.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
        this.login = this.login.bind(this);
        this.getCampaignsByUserId = this.getCampaignsByUserId.bind(this);
    }

    public async register(req: Request, res: Response): Promise<Response> {
        const payload = req.body as TCreateUserBody;

        const result = await this.createUserOperation.execute(payload);
        delete (result as Partial<RegisterUserResponse>).password;

        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async internalAuthentication(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatusCode.OK).json(res.locals);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body as RegisterUserPayload;

        const result = await this.updateUserOperation.execute({ userId: id, payload });
        delete (result as Partial<RegisterUserResponse>).password;

        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async getCampaignsByUserId(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getCampaignsByUserIdOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async verifyEmail(req: Request, res: Response): Promise<Response> {
        const query = req.query as unknown as VerifyEmailPayload;

        await this.verifyEmailOperation.execute(query);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async getUsers(req: Request, res: Response): Promise<Response> {
        const result = await this.getUsersOperation.execute();
        result.map((user) => delete (user as Partial<RegisterUserResponse>).password);

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getUserById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getUserByIdOperation.execute({ userId: id });
        delete (result as Partial<RegisterUserResponse>).password;
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async login(req: Request, res: Response): Promise<Response> {
        const { token } = req.user as Express.User;

        const { tokenData, cookieOptions } = await this.loginUserOperation.execute(token as string);

        return res.status(HttpStatusCode.OK).cookie('token', token, cookieOptions).json(tokenData);
    }

    public async activateSecretQuestion(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body as UserDetail['secretQuestion'];

        await this.activateSecretQuestionOperation.execute({ userId: id, payload });

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async updateSecretQuestion(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body as UpdateSecretQuestion;

        await this.updateSecretQuestionOperation.execute({ userId: id, payload });

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async activateTwoFactor(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.activateTwoFactorOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async resetTwoFactor(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.resetTwoFactorOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateEmail(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { email } = req.body;

        await this.updateEmailOperation.execute({ userId: id, email });
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async updatePassword(req: Request, res: Response): Promise<Response> {
        await this.updatePasswordOperation.execute(req.body);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async profilePicture(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const result = await this.pictureProfileOperation.execute({
            userId: id,
            image: req.file as FileObject,
        });
        delete (result as Partial<RegisterUserResponse>).password;

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateGameInfo(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body as Omit<UpdateGameInfoPayload, 'userId'>;

        const result = await this.updateGameInfoOperation.execute({
            userId: id,
            ...payload,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async resetProfile(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this.resetProfileOperation.execute(id);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async logoutUser(req: Request, res: Response): Promise<Response> {
        await this.logoutUserOperation.execute(req.token as string);
        res.clearCookie('token');
        res.clearCookie('session');
        res.clearCookie('session.sig');
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this.deleteUserOperation.execute(id);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }
}
