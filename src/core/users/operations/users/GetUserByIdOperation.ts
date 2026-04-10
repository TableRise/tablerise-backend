import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { GetByIdPayload } from 'src/types/api/users/http/payload';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

export default class GetUserByIdOperation {
    private readonly getUserByIdService;
    private readonly logger;

    constructor({ getUserByIdService, logger }: UserCoreDependencies['getUserByIdOperationContract']) {
        this.getUserByIdService = getUserByIdService;
        this.logger = logger;
    }

    public async execute({ userId }: GetByIdPayload): Promise<RegisterUserResponse> {
        this.logger('info', 'Execute - GetUserByIdOperation');
        return this.getUserByIdService.get({ userId });
    }
}
