import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { AnswerFriendRequestPayload, FriendLookupPayload, UserFriend } from 'src/types/api/users/http/payload';

export default class FriendsOperation {
    private readonly friendsService;
    private readonly logger;

    constructor({ friendsService, logger }: UserCoreDependencies['friendsOperationContract']) {
        this.friendsService = friendsService;
        this.logger = logger;
    }

    public async createRequest(payload: FriendLookupPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.createRequest.name}`;
        this.logger('info', callName);
        await this.friendsService.createRequest(payload);
    }

    public async getAll(userId: string): Promise<UserFriend[]> {
        const callName = `[${this.constructor.name}] - ${this.getAll.name}`;
        this.logger('info', callName);
        return this.friendsService.getAll(userId);
    }

    public async getById(payload: FriendLookupPayload): Promise<UserFriend> {
        const callName = `[${this.constructor.name}] - ${this.getById.name}`;
        this.logger('info', callName);
        return this.friendsService.getById(payload);
    }

    public async answerRequest(payload: AnswerFriendRequestPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.answerRequest.name}`;
        this.logger('info', callName);
        await this.friendsService.answerRequest(payload);
    }

    public async remove(payload: FriendLookupPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.remove.name}`;
        this.logger('info', callName);
        await this.friendsService.remove(payload);
    }
}
