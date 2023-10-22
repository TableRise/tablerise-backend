import { DeleteUserOperationContract } from 'src/types/contracts/users/DeleteUser';

export default class DeleteUserOperation {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({ usersRepository, logger }: DeleteUserOperationContract) {
        this._usersRepository = usersRepository;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<void> {
        this._logger('info', '[Execute - UpdateEmailOperation]');
        await this._usersRepository.delete(userId);
    }
}
