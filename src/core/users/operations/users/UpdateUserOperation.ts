import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateUserPayload } from 'src/types/api/users/http/payload';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

export default class UpdateUserOperation {
    private readonly _usersSchema;
    private readonly _schemaValidator;
    private readonly _updateUserService;
    private readonly _logger;

    constructor({
        usersSchema,
        updateUserService,
        schemaValidator,
        logger,
    }: UserCoreDependencies['updateUserOperationContract']) {
        this._usersSchema = usersSchema;
        this._schemaValidator = schemaValidator;
        this._updateUserService = updateUserService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, payload }: UpdateUserPayload): Promise<RegisterUserResponse> {
        this._logger('info', 'Execute - UpdateUserOperation');
        this._schemaValidator.entry(this._usersSchema.updateUserZod, payload);

        const { user, userDetails } = await this._updateUserService.update({
            userId,
            payload,
        });

        const userUpdated = await this._updateUserService.save({ user, userDetails });

        return userUpdated;
    }
}
