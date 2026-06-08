import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { GetByNicknameAndTagPayload } from 'src/types/api/users/http/payload';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

export default class GetUserByNicknameAndTagOperation {
    private readonly getUserByNicknameAndTagService;
    private readonly logger;

    constructor({
        getUserByNicknameAndTagService,
        logger,
    }: UserCoreDependencies['getUserByNicknameAndTagOperationContract']) {
        this.getUserByNicknameAndTagService = getUserByNicknameAndTagService;
        this.logger = logger;
    }

    public async execute({ nickname, tag }: GetByNicknameAndTagPayload): Promise<RegisterUserResponse> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return this.getUserByNicknameAndTagService.get({ nickname, tag });
    }
}
