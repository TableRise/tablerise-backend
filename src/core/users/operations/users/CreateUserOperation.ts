import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import { TCreateUserBody } from 'src/interface/users/presentation/users/UsersSchemas';

export default class CreateUserOperation {
    private readonly createUserService;
    private readonly logger;

    constructor({ createUserService, logger }: UserCoreDependencies['createUserOperationContract']) {
        this.createUserService = createUserService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: TCreateUserBody): Promise<RegisterUserResponse> {
        this.logger('info', 'Execute - CreateUserOperation');
        const entitySerialized = await this.createUserService.serialize(payload);

        const entityEnriched = await this.createUserService.enrichment({
            user: entitySerialized.userSerialized,
            userDetails: entitySerialized.userDetailsSerialized,
        });

        const entitySaved = await this.createUserService.save({
            user: entityEnriched.userEnriched,
            userDetails: entityEnriched.userDetailsEnriched,
        });

        return {
            ...entitySaved.userSaved,
            details: entitySaved.userDetailsSaved,
        };
    }
}
