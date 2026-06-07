import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { CreateMessagePayload, MessageLookupPayload, UserMessage } from 'src/types/api/users/http/payload';

export default class MessagesOperation {
    private readonly messagesService;
    private readonly logger;

    constructor({ messagesService, logger }: UserCoreDependencies['messagesOperationContract']) {
        this.messagesService = messagesService;
        this.logger = logger;
    }

    public async create(payload: CreateMessagePayload): Promise<UserMessage> {
        const callName = `[${this.constructor.name}] - ${this.create.name}`;
        this.logger('info', callName);
        return this.messagesService.create(payload);
    }

    public async getAll(userId: string): Promise<UserMessage[]> {
        const callName = `[${this.constructor.name}] - ${this.getAll.name}`;
        this.logger('info', callName);
        return this.messagesService.getAll(userId);
    }

    public async getById(payload: MessageLookupPayload): Promise<UserMessage> {
        const callName = `[${this.constructor.name}] - ${this.getById.name}`;
        this.logger('info', callName);
        return this.messagesService.getById(payload);
    }

    public async remove(payload: MessageLookupPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.remove.name}`;
        this.logger('info', callName);
        await this.messagesService.remove(payload);
    }

    public async markAsRead(payload: MessageLookupPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.markAsRead.name}`;
        this.logger('info', callName);
        await this.messagesService.markAsRead(payload);
    }
}
