import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateUserPayload } from 'src/types/api/users/http/payload';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

export default class UpdateUserOperation {
    private readonly updateUserService;
    private readonly logger;

    constructor({
        updateUserService,
        logger,
    }: UserCoreDependencies['updateUserOperationContract']) {
        this.updateUserService = updateUserService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, payload }: UpdateUserPayload): Promise<RegisterUserResponse> {
        this.logger('info', 'Execute - UpdateUserOperation');
        const { user, userDetails } = await this.updateUserService.update({
            userId,
            payload,
        });

        return this.updateUserService.save({ user, userDetails });
    }
}
