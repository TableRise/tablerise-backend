import { DeleteUserOperationContract } from 'src/types/users/contracts/core/DeleteUser';

export default class DeleteUserOperation {
    private readonly _deleteUserService;
    private readonly _logger;

    constructor({
        deleteUserService,
        logger,
    }: DeleteUserOperationContract) {
        this._deleteUserService = deleteUserService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<void> {
        this._logger('info', 'Execute - DeleteUserOperation');
        await this._deleteUserService.delete(userId);
    }
}
