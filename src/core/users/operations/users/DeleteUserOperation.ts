import { DeleteUserOperationContract } from 'src/types/users/contracts/core/DeleteUser';

export default class DeleteUserOperation {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: DeleteUserOperationContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<void> {
        this._logger('info', 'Execute - DeleteUserOperation');
        await this._usersRepository.delete({ userId });
        await this._usersDetailsRepository.delete({ userId });
    }
}
