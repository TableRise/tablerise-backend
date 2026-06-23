import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateUserXpPayload } from 'src/types/api/users/http/payload';

export default class UpdateUserXpOperation {
    private readonly updateUserXpService;
    private readonly logger;

    constructor({ updateUserXpService, logger }: UserCoreDependencies['updateUserXpOperationContract']) {
        this.updateUserXpService = updateUserXpService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: UpdateUserXpPayload): Promise<UserDetail> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return this.updateUserXpService.update(payload);
    }
}
