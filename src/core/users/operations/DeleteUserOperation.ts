import { DeleteUserOperationContract } from 'src/types/contracts/users/DeleteUser';

export default class DeleteUserOperation extends DeleteUserOperationContract {
    constructor({ usersRepository, logger }: DeleteUserOperationContract) {
        super();
        this.usersRepository = usersRepository;
        this.logger = logger;
    }

    public async execute(userId: string): Promise<void> {
        this.logger('info', '[Execute - UpdateEmailOperation]');
        await this.usersRepository.delete(userId);
    }
}
