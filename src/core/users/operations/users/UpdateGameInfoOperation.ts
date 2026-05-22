import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { AddGameInfoPayload, RemoveGameInfoPayload } from 'src/types/api/users/http/payload';

export default class UpdateGameInfoOperation {
    private readonly updateGameInfoService;
    private readonly logger;

    constructor({ updateGameInfoService, logger }: UserCoreDependencies['updateGameInfoOperationContract']) {
        this.updateGameInfoService = updateGameInfoService;
        this.logger = logger;

        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
    }

    public async add(payload: AddGameInfoPayload): Promise<string> {
        const callName = `[${this.constructor.name}] - ${this.add.name}`;
        this.logger('info', callName);
        return this.updateGameInfoService.add(payload);
    }

    public async remove(payload: RemoveGameInfoPayload): Promise<string> {
        const callName = `[${this.constructor.name}] - ${this.remove.name}`;
        this.logger('info', callName);
        return this.updateGameInfoService.remove(payload);
    }
}
