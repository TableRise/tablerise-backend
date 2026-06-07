import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { AnswerFriendRequestPayload, FriendLookupPayload, UserFriend } from 'src/types/api/users/http/payload';
import { ensureUserDetailCollections, getFriendStatus } from 'src/domains/users/helpers/UserDetailCollections';

export default class FriendsService {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({ usersRepository, usersDetailsRepository, logger }: UserCoreDependencies['friendsServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;
    }

    private buildFriendEntry(payload: {
        userId: string;
        nickname: string;
        tag: string;
        picture?: { link?: string } | null;
        rank?: string | null;
        status: 'pending' | 'active';
    }): UserFriend {
        return {
            userId: payload.userId,
            nickname: payload.nickname,
            tag: payload.tag,
            picture: payload.picture?.link ?? '',
            rank: payload.rank ?? 'bronze',
            status: payload.status,
        };
    }

    public async createRequest({ userId, targetUserId }: FriendLookupPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.createRequest.name}`;
        this.logger('info', callName);

        if (userId === targetUserId) {
            throw new HttpRequestErrors({
                message: 'You cannot add yourself as a friend',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });
        }

        const sender = await this.usersRepository.findOne({ userId });
        await this.usersRepository.findOne({ userId: targetUserId });
        const senderDetails = await this.usersDetailsRepository.findOne({ userId });
        const targetDetails = await this.usersDetailsRepository.findOne({ userId: targetUserId });

        ensureUserDetailCollections(senderDetails);
        ensureUserDetailCollections(targetDetails);

        const targetHasRequest = targetDetails.friends.some((friend) => friend.userId === userId);
        const senderHasActiveFriend = senderDetails.friends.some(
            (friend) => friend.userId === targetUserId && getFriendStatus(friend) === 'active'
        );

        if (targetHasRequest || senderHasActiveFriend) {
            throw new HttpRequestErrors({
                message: 'Friend request already exists',
                code: HttpStatusCode.CONFLICT,
                name: getErrorName(HttpStatusCode.CONFLICT),
            });
        }

        targetDetails.friends.push(
            this.buildFriendEntry({
                userId,
                nickname: sender.nickname,
                tag: sender.tag,
                picture: sender.picture,
                rank: senderDetails.rank,
                status: 'pending',
            })
        );

        await this.usersDetailsRepository.update({
            query: { userDetailId: targetDetails.userDetailId },
            payload: targetDetails,
        });
    }

    public async getAll(userId: string): Promise<UserFriend[]> {
        const callName = `[${this.constructor.name}] - ${this.getAll.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        ensureUserDetailCollections(userDetails);

        return userDetails.friends;
    }

    public async getById({ userId, targetUserId }: FriendLookupPayload): Promise<UserFriend> {
        const callName = `[${this.constructor.name}] - ${this.getById.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        ensureUserDetailCollections(userDetails);

        const friend = userDetails.friends.find((entry) => entry.userId === targetUserId);
        if (!friend) {
            throw new HttpRequestErrors({
                message: 'Friend does not exist',
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });
        }

        return friend;
    }

    public async answerRequest({ userId, targetUserId, decline = false }: AnswerFriendRequestPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.answerRequest.name}`;
        this.logger('info', callName);

        const accepter = await this.usersRepository.findOne({ userId });
        const accepterDetails = await this.usersDetailsRepository.findOne({ userId });
        const requesterDetails = await this.usersDetailsRepository.findOne({ userId: targetUserId });

        ensureUserDetailCollections(accepterDetails);
        ensureUserDetailCollections(requesterDetails);

        const friendIndex = accepterDetails.friends.findIndex((friend) => friend.userId === targetUserId);

        if (friendIndex === -1) {
            throw new HttpRequestErrors({
                message: 'Friend request does not exist',
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });
        }

        if (decline) {
            accepterDetails.friends.splice(friendIndex, 1);

            await this.usersDetailsRepository.update({
                query: { userDetailId: accepterDetails.userDetailId },
                payload: accepterDetails,
            });

            return;
        }

        accepterDetails.friends[friendIndex].status = 'active';

        const mirroredFriend = this.buildFriendEntry({
            userId,
            nickname: accepter.nickname,
            tag: accepter.tag,
            picture: accepter.picture,
            rank: accepterDetails.rank,
            status: 'active',
        });
        const existingMirrored = requesterDetails.friends.find((friend) => friend.userId === userId);

        if (existingMirrored) {
            Object.assign(existingMirrored, mirroredFriend);
        } else {
            requesterDetails.friends.push(mirroredFriend);
        }

        await this.usersDetailsRepository.update({
            query: { userDetailId: accepterDetails.userDetailId },
            payload: accepterDetails,
        });
        await this.usersDetailsRepository.update({
            query: { userDetailId: requesterDetails.userDetailId },
            payload: requesterDetails,
        });
    }

    public async remove({ userId, targetUserId }: FriendLookupPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.remove.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        ensureUserDetailCollections(userDetails);

        const friend = userDetails.friends.find((entry) => entry.userId === targetUserId);
        if (!friend) {
            throw new HttpRequestErrors({
                message: 'Friend does not exist',
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });
        }

        userDetails.friends = userDetails.friends.filter((entry) => entry.userId !== targetUserId);
        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });

        if (getFriendStatus(friend) !== 'active') return;

        try {
            const targetDetails = await this.usersDetailsRepository.findOne({ userId: targetUserId });
            ensureUserDetailCollections(targetDetails);
            targetDetails.friends = targetDetails.friends.filter((entry) => entry.userId !== userId);

            await this.usersDetailsRepository.update({
                query: { userDetailId: targetDetails.userDetailId },
                payload: targetDetails,
            });
        } catch (error) {
            if (!(error instanceof HttpRequestErrors) || error.code !== HttpStatusCode.NOT_FOUND) throw error;
        }
    }
}
