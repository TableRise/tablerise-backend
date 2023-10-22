import { RegisterUserResponse } from 'src/types/requests/Response';
import { RegisterUserPayload } from 'src/types/requests/Payload';
import { CreateUserOperationContract } from 'src/types/contracts/users/CreateUser';

export default class CreateUserOperation {
    private readonly _usersSchema;
    private readonly _schemaValidator;
    private readonly _createUserService;
    private readonly _logger;

    constructor({ usersSchema, schemaValidator, createUserService, logger }: CreateUserOperationContract) {
        this._usersSchema = usersSchema;
        this._schemaValidator = schemaValidator;
        this._createUserService = createUserService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(user: RegisterUserPayload): Promise<RegisterUserResponse> {
        this._logger('info', '[Execute - CreateUserOperation]');
        this._schemaValidator.entry(this._usersSchema.userZod, user);
        this._schemaValidator.entry(this._usersSchema.userDetailZod, user.details);

        const entitySerialized = await this._createUserService.serialize(user);

        const entityEnriched = await this._createUserService.enrichment({
            user: entitySerialized.userSerialized,
            userDetails: entitySerialized.userDetailsSerialized,
        });

        const entitySaved = await this._createUserService.saveUser({
            user: entityEnriched.userEnriched,
            userDetails: entityEnriched.userDetailsEnriched,
        });

        return {
            ...entitySaved.userSaved,
            details: entitySaved.userDetailsSaved,
        };
    }
}
