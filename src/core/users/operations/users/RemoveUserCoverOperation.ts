import { RemoveUserCoverPayload } from 'src/types/api/users/http/payload';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class RemoveUserCoverOperation {
    private readonly logger;
    private readonly removeUserCoverService;

    constructor({ removeUserCoverService, logger }: UserCoreDependencies['removeUserCoverOperationContract']) {
        this.logger = logger;
        this.removeUserCoverService = removeUserCoverService;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: RemoveUserCoverPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        await this.removeUserCoverService.remove(payload);
    }
}
