import { UpdateUserOperationContract } from 'src/types/contracts/users/UpdateUser';
import { UpdateUserPayload } from 'src/types/requests/Payload';
import { RegisterUserResponse } from 'src/types/requests/Response';

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
    }: UpdateUserOperationContract) {
        this._usersSchema = usersSchema;
        this._schemaValidator = schemaValidator;
        this._updateUserService = updateUserService;
        this._logger = logger;
    }

    public async execute({
        userId,
        payload,
    }: UpdateUserPayload): Promise<RegisterUserResponse> {
        const { details, ...userPayload } = payload;
        this._schemaValidator.entry(this._usersSchema.userZod, userPayload);
        this._schemaValidator.entry(this._usersSchema.userDetailZod, details);

        const { user, userDetails } = await this._updateUserService.update({
            userId,
            payload,
        });

        const userUpdated = await this._updateUserService.save({ user, userDetails });

        return userUpdated;
    }
}
