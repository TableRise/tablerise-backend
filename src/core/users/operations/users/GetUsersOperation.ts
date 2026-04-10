import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

export default class GetUsersOperation {
    private readonly getUsersService;
    private readonly logger;

    constructor({ getUsersService, logger }: UserCoreDependencies['getUsersOperationContract']) {
        this.getUsersService = getUsersService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<RegisterUserResponse[]> {
        this.logger('info', 'Execute - GetUsersOperation');
        return this.getUsersService.get();
    }
}
