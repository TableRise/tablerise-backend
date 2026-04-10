import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class DeleteUserOperation {
    private readonly deleteUserService;
    private readonly logger;

    constructor({ deleteUserService, logger }: UserCoreDependencies['deleteUserOperationContract']) {
        this.deleteUserService = deleteUserService;
        this.logger = logger;
        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<void> {
        this.logger('info', 'Execute - DeleteUserOperation');
        await this.deleteUserService.delete(userId);
    }
}
