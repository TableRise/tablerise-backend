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
import parseRequestJsonField from 'src/interface/common/helpers/parseRequestJsonField';
import {
    TCreateUserBody,
    TAcceptFriendQuery,
    TGetUserByNicknameAndTagQuery,
    TPostMessageBody,
    TPostSupportEmailBody,
    TRegisterDonationBody,
    TRegisterDonationQuery,
    TUpdateCampaignNotesBody,
    TUpdateCampaignNotesQuery,
} from './UsersSchemas';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import getErrorName from 'src/domains/common/helpers/getErrorName';

export default class UsersController {
    private readonly createUserOperation;
    private readonly updateUserOperation;
    private readonly updateUserDetailsOperation;
    private readonly verifyEmailOperation;
    private readonly getUsersOperation;
    private readonly getUserByIdOperation;
    private readonly getUserByNicknameAndTagOperation;
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
    private readonly messagesOperation;
    private readonly galleryOperation;
    private readonly friendsOperation;

    private normalizeBooleanQuery(value: unknown): boolean {
        if (value === true || value === 'true') return true;
        if (value === false || value === 'false') return false;
        return Boolean(value);
    }

    private getAuthCookieOptions(): {
        domain: string | undefined;
        httpOnly: boolean;
        path: string;
        sameSite: 'none' | 'lax';
        secure: boolean;
    } {
        const secure = process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'yes';

        return {
            httpOnly: true,
            secure,
            domain: process.env.DOMAIN_COOKIE,
            sameSite: secure ? 'none' : 'lax',
            path: '/',
        };
    }

    private assertOwner(routeUserId: string, authenticatedUserId: string): void {
        if (routeUserId !== authenticatedUserId) HttpRequestErrors.throwError('unauthorized');
    }

    private assertUuid(value: string, parameterName: string): void {
        const isValidUUID = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

        if (!isValidUUID.test(value)) {
            throw new HttpRequestErrors({
                message: `The parameter ${parameterName} is invalid`,
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });
        }
    }

    constructor({
        createUserOperation,
        updateUserOperation,
        updateUserDetailsOperation,
        verifyEmailOperation,
        getUsersOperation,
        getUserByIdOperation,
        getUserByNicknameAndTagOperation,
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
        messagesOperation,
        galleryOperation,
        friendsOperation,
    }: InterfaceDependencies['usersControllerContract']) {
        this.createUserOperation = createUserOperation;
        this.updateUserOperation = updateUserOperation;
        this.updateUserDetailsOperation = updateUserDetailsOperation;
        this.verifyEmailOperation = verifyEmailOperation;
        this.getUsersOperation = getUsersOperation;
        this.getUserByIdOperation = getUserByIdOperation;
        this.getUserByNicknameAndTagOperation = getUserByNicknameAndTagOperation;
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
        this.messagesOperation = messagesOperation;
        this.galleryOperation = galleryOperation;
        this.friendsOperation = friendsOperation;

        this.register = this.register.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.updateUserDetails = this.updateUserDetails.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getUserByNicknameAndTag = this.getUserByNicknameAndTag.bind(this);
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
        this.postMessage = this.postMessage.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.getMessageById = this.getMessageById.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.markMessageAsRead = this.markMessageAsRead.bind(this);
        this.getGallery = this.getGallery.bind(this);
        this.getGalleryImage = this.getGalleryImage.bind(this);
        this.deleteGalleryImage = this.deleteGalleryImage.bind(this);
        this.postFriendRequest = this.postFriendRequest.bind(this);
        this.getFriends = this.getFriends.bind(this);
        this.getFriendById = this.getFriendById.bind(this);
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
        this.toggleFavoriteFriend = this.toggleFavoriteFriend.bind(this);
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

    public async postMessage(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const payload = req.body as TPostMessageBody;

        this.assertOwner(id, userId);

        const result = await this.messagesOperation.create({
            senderId: id,
            ...payload,
        });

        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async getMessages(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);

        const result = await this.messagesOperation.getAll(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getMessageById(req: Request, res: Response): Promise<Response> {
        const { id, messageId } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);

        const result = await this.messagesOperation.getById({ userId: id, messageId });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async deleteMessage(req: Request, res: Response): Promise<Response> {
        const { id, messageId } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);

        await this.messagesOperation.remove({ userId: id, messageId });
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async markMessageAsRead(req: Request, res: Response): Promise<Response> {
        const { id, messageId } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);

        await this.messagesOperation.markAsRead({ userId: id, messageId });
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async getGallery(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);

        const result = await this.galleryOperation.getAll(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getGalleryImage(req: Request, res: Response): Promise<Response> {
        const { id, imageId } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);

        const result = await this.galleryOperation.getById({ userId: id, imageId });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async deleteGalleryImage(req: Request, res: Response): Promise<Response> {
        const { id, imageId } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);

        await this.galleryOperation.remove({ userId: id, imageId });
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async postFriendRequest(req: Request, res: Response): Promise<Response> {
        const { id, targetUserId } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);
        this.assertUuid(targetUserId, 'targetUserId');

        await this.friendsOperation.createRequest({ userId: id, targetUserId });
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async getFriends(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.friendsOperation.getAll(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getFriendById(req: Request, res: Response): Promise<Response> {
        const { id, targetUserId } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);
        this.assertUuid(targetUserId, 'targetUserId');

        const result = await this.friendsOperation.getById({ userId: id, targetUserId });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async acceptFriendRequest(req: Request, res: Response): Promise<Response> {
        const { id, targetUserId } = req.params;
        const { userId } = req.user as Express.User;
        const { decline = false } = req.query as unknown as TAcceptFriendQuery;

        this.assertOwner(id, userId);
        this.assertUuid(targetUserId, 'targetUserId');

        await this.friendsOperation.answerRequest({ userId: id, targetUserId, decline });
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async removeFriend(req: Request, res: Response): Promise<Response> {
        const { id, targetUserId } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);
        this.assertUuid(targetUserId, 'targetUserId');

        await this.friendsOperation.remove({ userId: id, targetUserId });
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async toggleFavoriteFriend(req: Request, res: Response): Promise<Response> {
        const { id, targetUserId } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);
        this.assertUuid(targetUserId, 'targetUserId');

        await this.friendsOperation.toggleFavorite({ userId: id, targetUserId });
        return res.status(HttpStatusCode.NO_CONTENT).end();
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

    public async getUserByNicknameAndTag(req: Request, res: Response): Promise<Response> {
        const { nickname: nicknameHandle } = req.query as unknown as TGetUserByNicknameAndTagQuery;
        const hashIndex = nicknameHandle.lastIndexOf('#');
        const nickname = nicknameHandle.slice(0, hashIndex);
        const tag = nicknameHandle.slice(hashIndex);

        const result = await this.getUserByNicknameAndTagOperation.execute({ nickname, tag });
        delete (result as Partial<RegisterUserResponse>).password;

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
            image: req.file as FileObject | undefined,
            imageObject: parseRequestJsonField(req.body?.imageObject),
        });
        delete (result as Partial<RegisterUserResponse>).password;

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateUserCover(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);

        await this.updateUserCoverOperation.execute({
            userId: id,
            image: req.file as FileObject | undefined,
            imageObject: parseRequestJsonField(req.body?.imageObject),
        });

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async removeUserCover(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;

        this.assertOwner(id, userId);

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

        this.assertOwner(id, userId);

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

        this.assertOwner(id, userId);

        await this.registerDonationOperation.execute({
            userId: id,
            validation,
            payload,
        } as RegisterDonationPayload);

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async logoutUser(req: Request, res: Response): Promise<Response> {
        await this.logoutUserOperation.execute(req.token as string);
        res.clearCookie('token', this.getAuthCookieOptions());
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this.deleteUserOperation.execute(id);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }
}
