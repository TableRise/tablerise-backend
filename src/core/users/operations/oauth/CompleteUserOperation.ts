import OAuthCoreDependencies from 'src/types/modules/core/users/OAuthCoreDependencies';
import { CompleteOAuth } from 'src/types/api/users/http/payload';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

export default class CompleteUserOperation {
    private readonly schemaValidator;
    private readonly completeUserService;
    private readonly getUserByIdService;
    private readonly logger;

    constructor({
        completeUserService,
        getUserByIdService,
        schemaValidator,
        logger,
    }: OAuthCoreDependencies['completeUserOperationContract']) {
        this.schemaValidator = schemaValidator;
        this.completeUserService = completeUserService;
        this.getUserByIdService = getUserByIdService;
        this.logger = logger;
    }

    public async execute({ userId, payload }: CompleteOAuth): Promise<RegisterUserResponse> {
        this.logger('info', 'Execute - CompleteUserOperation');
        const { details, ...user } = await this.getUserByIdService.get({ userId });
        const { user: mainUser, userDetails } = await this.completeUserService.process(
            { user, userDetails: details },
            payload
        );

        return this.completeUserService.save({
            userId,
            user: mainUser,
            userDetails,
        });
    }
}
