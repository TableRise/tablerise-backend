import OAuthCoreDependencies from 'src/types/modules/core/users/OAuthCoreDependencies';
import { CompleteOAuth } from 'src/types/users/requests/Payload';
import { RegisterUserResponse } from 'src/types/users/requests/Response';

export default class CompleteUserOperation {
    private readonly _usersSchema;
    private readonly _schemaValidator;
    private readonly _completeUserService;
    private readonly _getUserByIdService;
    private readonly _logger;

    constructor({
        usersSchema,
        completeUserService,
        getUserByIdService,
        schemaValidator,
        logger,
    }: OAuthCoreDependencies['completeUserOperationContract']) {
        this._usersSchema = usersSchema;
        this._schemaValidator = schemaValidator;
        this._completeUserService = completeUserService;
        this._getUserByIdService = getUserByIdService;
        this._logger = logger;
    }

    public async execute({
        userId,
        payload,
    }: CompleteOAuth): Promise<RegisterUserResponse> {
        this._logger('info', 'Execute - CompleteUserOperation');
        this._schemaValidator.entry(this._usersSchema.oAuthComplete, payload);

        const { details, ...user } = await this._getUserByIdService.get({ userId });
        const { user: mainUser, userDetails } = await this._completeUserService.process(
            { user, userDetails: details },
            payload
        );

        const userSaved = await this._completeUserService.save({
            userId,
            user: mainUser,
            userDetails,
        });

        return userSaved;
    }
}
