import { UpdateUserOperationContract } from 'src/types/users/contracts/core/UpdateUser';
import { UpdateUserPayload } from 'src/types/users/requests/Payload';
import { RegisterUserResponse } from 'src/types/users/requests/Response';

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

        this.execute = this.execute.bind(this);
    }

    public async execute({
        userId,
        payload,
    }: UpdateUserPayload): Promise<RegisterUserResponse> {
        const { user, userDetails } = await this._updateUserService.update({
            userId,
            payload,
        });

        const userUpdated = await this._updateUserService.save({ user, userDetails });

        return userUpdated;
    }
}