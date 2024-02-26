import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

export default class GetUsersOperation {
    private readonly _getUsersService;
    private readonly _logger;

    constructor({ getUsersService, logger }: UserCoreDependencies['getUsersOperationContract']) {
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
