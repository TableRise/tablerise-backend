import { UpdateUserCoverPayload } from 'src/types/api/users/http/payload';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class UpdateUserCoverOperation {
    private readonly logger;
    private readonly updateUserCoverService;

    constructor({ updateUserCoverService, logger }: UserCoreDependencies['updateUserCoverOperationContract']) {
        this.logger = logger;
        this.updateUserCoverService = updateUserCoverService;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: UpdateUserCoverPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        await this.updateUserCoverService.update(payload);
    }
}
