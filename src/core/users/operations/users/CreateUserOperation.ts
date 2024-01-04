import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { RegisterUserResponse } from 'src/types/users/requests/Response';
import { RegisterUserPayload } from 'src/types/users/requests/Payload';

export default class CreateUserOperation {
    private readonly _usersSchema;
    private readonly _schemaValidator;
    private readonly _createUserService;
    private readonly _logger;

    constructor({
        usersSchema,
        schemaValidator,
        createUserService,
        logger,
    }: UserCoreDependencies['createUserOperationContract']) {
        this._usersSchema = usersSchema;
        this._schemaValidator = schemaValidator;
        this._createUserService = createUserService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: RegisterUserPayload): Promise<RegisterUserResponse> {
        this._logger('info', 'Execute - CreateUserOperation');
        const { details, ...user } = payload;
        this._schemaValidator.entry(this._usersSchema.userZod, user);
        this._schemaValidator.entry(this._usersSchema.userDetailZod, details);

        const entitySerialized = await this._createUserService.serialize({
            ...user,
            details,
        });

        const entityEnriched = await this._createUserService.enrichment({
            user: entitySerialized.userSerialized,
            userDetails: entitySerialized.userDetailsSerialized,
        });

        const entitySaved = await this._createUserService.save({
            user: entityEnriched.userEnriched,
            userDetails: entityEnriched.userDetailsEnriched,
        });

        return {
            ...entitySaved.userSaved,
            details: entitySaved.userDetailsSaved,
        };
    }
}
