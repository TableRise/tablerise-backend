import { RegisterUserPayload, RegisterUserResponse } from 'src/types/Response';
import { CreateUserOperationContract } from 'src/types/contracts/users/CreateUser';

export default class CreateUserOperation extends CreateUserOperationContract {
    constructor({ usersSchema, schemaValidator, createUserService, logger }: CreateUserOperationContract) {
        super();
        this.usersSchema = usersSchema;
        this.schemaValidator = schemaValidator;
        this.createUserService = createUserService;
        this.logger = logger;
    }

    public async execute(user: RegisterUserPayload): Promise<RegisterUserResponse> {
        this.logger('info', '[Execute - CreateUserOperation]');
        this.schemaValidator.entry(this.usersSchema.userZod, user);
        this.schemaValidator.entry(this.usersSchema.userDetailZod, user.details);

        const entitySerialized = await this.createUserService.serialize(user);

        const entityEnriched = await this.createUserService.enrichment({
            user: entitySerialized.userSerialized,
            userDetails: entitySerialized.userDetailsSerialized
        });

        const entitySaved = await this.createUserService.saveUser({
            user: entityEnriched.userEnriched,
            userDetails: entityEnriched.userDetailsEnriched
        });

        return {
            ...entitySaved.userSaved,
            details: entitySaved.userDetailsSaved
        }
    }
};
