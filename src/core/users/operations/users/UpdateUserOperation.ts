import User from '@tablerise/database-management/dist/src/interfaces/User';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateUserPayload } from 'src/types/api/users/http/payload';

export default class UpdateUserOperation {
    private readonly updateUserService;
    private readonly logger;

    constructor({ updateUserService, logger }: UserCoreDependencies['updateUserOperationContract']) {
        this.updateUserService = updateUserService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, payload }: UpdateUserPayload): Promise<User> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return this.updateUserService.update({ userId, payload });
    }
}
