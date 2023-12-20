import { GetUsersOperationContract } from 'src/types/users/contracts/core/GetUsers';
import { RegisterUserResponse } from 'src/types/users/requests/Response';

export default class GetUsersOperation {
    private readonly _getUsersService;
    private readonly _logger;

    constructor({ getUsersService, logger }: GetUsersOperationContract) {
        this._getUsersService = getUsersService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<RegisterUserResponse[]> {
        this._logger('info', 'Execute - GetUsersOperation');
        const users = await this._getUsersService.get();
        return users;
    }
}
