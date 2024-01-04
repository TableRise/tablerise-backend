import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { GetByIdPayload } from 'src/types/users/requests/Payload';
import { RegisterUserResponse } from 'src/types/users/requests/Response';

export default class GetUserByIdOperation {
    private readonly _getUserByIdService;
    private readonly _logger;

    constructor({ getUserByIdService, logger }: UserCoreDependencies['getUserByIdOperationContract']) {
        this._getUserByIdService = getUserByIdService;
        this._logger = logger;
    }

    public async execute({ userId }: GetByIdPayload): Promise<RegisterUserResponse> {
        this._logger('info', 'Execute - GetUserByIdOperation');
        const user = await this._getUserByIdService.get({ userId });
        return user;
    }
}
