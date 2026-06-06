import { Response, Request } from 'express';
import {
    AddCampaignNotePayload,
    RegisterDonationPayload,
    PostSupportEmailPayload,
    UpdateUserDetailsPayload,
    UpdateUserPayload,
    VerifyEmailPayload,
} from 'src/types/api/users/http/payload';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { FileObject } from 'src/types/shared/file';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import {
    TCreateUserBody,
    TPostSupportEmailBody,
    TRegisterDonationBody,
    TRegisterDonationQuery,
    TUpdateCampaignNotesBody,
    TUpdateCampaignNotesQuery,
} from './UsersSchemas';
import User from '@tablerise/database-management/dist/src/interfaces/User';

export default class UsersController {
    private readonly createUserOperation;
    private readonly updateUserOperation;
    private readonly updateUserDetailsOperation;
    private readonly verifyEmailOperation;
    private readonly getUsersOperation;
    private readonly getUserByIdOperation;
    private readonly activateTwoFactorOperation;
    private readonly deactivateTwoFactorOperation;
    private readonly updateEmailOperation;
    private readonly updatePasswordOperation;
    private readonly addCampaignNoteOperation;
    private readonly pictureProfileOperation;
    private readonly postSupportEmailOperation;
    private readonly registerDonationOperation;
    private readonly updateUserCoverOperation;
    private readonly removeUserCoverOperation;
    private readonly deleteUserOperation;
    private readonly logoutUserOperation;
    private readonly loginUserOperation;
    private readonly getCampaignsByUserIdOperation;

    private normalizeBooleanQuery(value: unknown): boolean {
        if (value === true || value === 'true') return true;
        if (value === false || value === 'false') return false;
        return Boolean(value);
    }

    constructor({
        createUserOperation,
        updateUserOperation,
        updateUserDetailsOperation,
        verifyEmailOperation,
        getUsersOperation,
        getUserByIdOperation,
        activateTwoFactorOperation,
        deactivateTwoFactorOperation,
        updateEmailOperation,
        updatePasswordOperation,
        addCampaignNoteOperation,
        pictureProfileOperation,
        postSupportEmailOperation,
        registerDonationOperation,
        updateUserCoverOperation,
        removeUserCoverOperation,
        deleteUserOperation,
        logoutUserOperation,
        loginUserOperation,
        getCampaignsByUserIdOperation,
    }: InterfaceDependencies['usersControllerContract']) {
        this.createUserOperation = createUserOperation;
        this.updateUserOperation = updateUserOperation;
        this.updateUserDetailsOperation = updateUserDetailsOperation;
        this.verifyEmailOperation = verifyEmailOperation;
        this.getUsersOperation = getUsersOperation;
        this.getUserByIdOperation = getUserByIdOperation;
        this.activateTwoFactorOperation = activateTwoFactorOperation;
        this.deactivateTwoFactorOperation = deactivateTwoFactorOperation;
        this.updateEmailOperation = updateEmailOperation;
        this.updatePasswordOperation = updatePasswordOperation;
        this.addCampaignNoteOperation = addCampaignNoteOperation;
        this.pictureProfileOperation = pictureProfileOperation;
        this.postSupportEmailOperation = postSupportEmailOperation;
        this.registerDonationOperation = registerDonationOperation;
        this.updateUserCoverOperation = updateUserCoverOperation;
        this.removeUserCoverOperation = removeUserCoverOperation;
        this.deleteUserOperation = deleteUserOperation;
        this.logoutUserOperation = logoutUserOperation;
        this.loginUserOperation = loginUserOperation;
        this.getCampaignsByUserIdOperation = getCampaignsByUserIdOperation;

        this.register = this.register.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.updateUserDetails = this.updateUserDetails.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.currentUser = this.currentUser.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.activateTwoFactor = this.activateTwoFactor.bind(this);
        this.deactivateTwoFactor = this.deactivateTwoFactor.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.updateCampaignNotes = this.updateCampaignNotes.bind(this);
        this.postSupportEmail = this.postSupportEmail.bind(this);
        this.registerDonation = this.registerDonation.bind(this);
        this.profilePicture = this.profilePicture.bind(this);
        this.updateUserCover = this.updateUserCover.bind(this);
        this.removeUserCover = this.removeUserCover.bind(this);
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

    public async updateUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body as UpdateUserPayload['payload'];

        const result = await this.updateUserOperation.execute({ userId: id, payload });
        delete (result as Partial<User>).password;

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateUserDetails(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body as UpdateUserDetailsPayload['payload'];

        const result = await this.updateUserDetailsOperation.execute({ userId: id, payload });

        return res.status(HttpStatusCode.OK).json(result);
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

    public async currentUser(req: Request, res: Response): Promise<Response> {
        const { userId } = req.user as Express.User;

        const result = await this.getUserByIdOperation.execute({ userId });
        delete (result as Partial<RegisterUserResponse>).password;

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

    public async activateTwoFactor(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.activateTwoFactorOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async deactivateTwoFactor(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this.deactivateTwoFactorOperation.execute(id);
        return res.status(HttpStatusCode.NO_CONTENT).end();
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

    public async updateUserCover(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;

        if (id !== userId) HttpRequestErrors.throwError('unauthorized');

        await this.updateUserCoverOperation.execute({
            userId: id,
            image: req.file as FileObject,
        });

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async removeUserCover(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;

        if (id !== userId) HttpRequestErrors.throwError('unauthorized');

        await this.removeUserCoverOperation.execute({ userId: id });

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async updateCampaignNotes(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { campaignId } = req.query as unknown as TUpdateCampaignNotesQuery;
        const payload = req.body as TUpdateCampaignNotesBody;

        const result = await this.addCampaignNoteOperation.execute({
            userId: id,
            campaignId,
            note: payload,
        } as AddCampaignNotePayload);

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async postSupportEmail(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const payload = req.body as TPostSupportEmailBody;

        if (id !== userId) HttpRequestErrors.throwError('unauthorized');

        await this.postSupportEmailOperation.execute({
            userId,
            payload,
        } as PostSupportEmailPayload);

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async registerDonation(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const query = req.query as unknown as TRegisterDonationQuery;
        const payload = req.body as TRegisterDonationBody;
        const validation = this.normalizeBooleanQuery(query.validation);

        if (id !== userId) HttpRequestErrors.throwError('unauthorized');

        await this.registerDonationOperation.execute({
            userId: id,
            validation,
            payload,
        } as RegisterDonationPayload);

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
