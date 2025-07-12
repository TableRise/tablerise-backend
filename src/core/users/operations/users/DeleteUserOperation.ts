import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class DeleteUserOperation {
    private readonly _deleteUserService;
    private readonly _logger;

    constructor({ deleteUserService, logger }: UserCoreDependencies['deleteUserOperationContract']) {
        this._deleteUserService = deleteUserService;
        this._logger = logger;
        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<void> {
        this._logger('info', 'Execute - DeleteUserOperation');
        await this._deleteUserService.delete(userId);
    }
}
