import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import newUUID from 'src/domains/common/helpers/newUUID';
import { CreateMessagePayload, MessageLookupPayload, UserMessage } from 'src/types/api/users/http/payload';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { ensureUserDetailCollections, getFriendStatus } from 'src/domains/users/helpers/UserDetailCollections';

export default class MessagesService {
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({ usersDetailsRepository, logger }: UserCoreDependencies['messagesServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;
    }

    public async create({ senderId, targetUserId, title, content }: CreateMessagePayload): Promise<UserMessage> {
        const callName = `[${this.constructor.name}] - ${this.create.name}`;
        this.logger('info', callName);

        const senderDetails = await this.usersDetailsRepository.findOne({ userId: senderId });
        const targetDetails = await this.usersDetailsRepository.findOne({ userId: targetUserId });

        ensureUserDetailCollections(senderDetails);
        ensureUserDetailCollections(targetDetails);

        const isActiveFriend = senderDetails.friends.some(
            (friend) => friend.userId === targetUserId && getFriendStatus(friend) === 'active'
        );

        if (!isActiveFriend) {
            throw new HttpRequestErrors({
                message: 'The target user is not an active friend',
                code: HttpStatusCode.FORBIDDEN,
                name: getErrorName(HttpStatusCode.FORBIDDEN),
            });
        }

        const message: UserMessage = {
            messageId: newUUID(),
            title,
            content,
            userId: senderId,
            timestamp: new Date().toISOString(),
            status: 'not-read',
        };

        targetDetails.messages.push(message);

        await this.usersDetailsRepository.update({
            query: { userDetailId: targetDetails.userDetailId },
            payload: targetDetails,
        });

        return message;
    }

    public async getAll(userId: string): Promise<UserMessage[]> {
        const callName = `[${this.constructor.name}] - ${this.getAll.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        ensureUserDetailCollections(userDetails);

        return userDetails.messages as UserMessage[];
    }

    public async getById({ userId, messageId }: MessageLookupPayload): Promise<UserMessage> {
        const callName = `[${this.constructor.name}] - ${this.getById.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        ensureUserDetailCollections(userDetails);

        const message = userDetails.messages.find((entry) => entry.messageId === messageId);
        if (!message) {
            throw new HttpRequestErrors({
                message: 'Message does not exist',
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });
        }

        return message as UserMessage;
    }

    public async remove({ userId, messageId }: MessageLookupPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.remove.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        ensureUserDetailCollections(userDetails);

        const previousLength = userDetails.messages.length;
        userDetails.messages = userDetails.messages.filter((entry) => entry.messageId !== messageId);

        if (previousLength === userDetails.messages.length) {
            throw new HttpRequestErrors({
                message: 'Message does not exist',
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });
        }

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });
    }

    public async markAsRead({ userId, messageId }: MessageLookupPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.markAsRead.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        ensureUserDetailCollections(userDetails);

        const message = userDetails.messages.find((entry) => entry.messageId === messageId);
        if (!message) {
            throw new HttpRequestErrors({
                message: 'Message does not exist',
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });
        }

        message.status = 'read';

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });
    }
}
