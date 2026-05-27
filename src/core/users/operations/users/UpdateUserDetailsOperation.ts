import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateUserDetailsPayload } from 'src/types/api/users/http/payload';

export default class UpdateUserDetailsOperation {
    private readonly updateUserDetailsService;
    private readonly logger;

    constructor({ updateUserDetailsService, logger }: UserCoreDependencies['updateUserDetailsOperationContract']) {
        this.updateUserDetailsService = updateUserDetailsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, payload }: UpdateUserDetailsPayload): Promise<UserDetail> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return this.updateUserDetailsService.update({ userId, payload });
    }
}
