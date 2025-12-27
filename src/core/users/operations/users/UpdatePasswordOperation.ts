import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdatePasswordPayload } from 'src/types/api/users/http/payload';

export default class UpdatePasswordOperation {
    private readonly updatePasswordService;
    private readonly schemaValidator;
    private readonly usersSchema;
    private readonly logger;

    constructor({
        usersSchema,
        updatePasswordService,
        schemaValidator,
        logger,
    }: UserCoreDependencies['updatePasswordOperationContract']) {
        this.updatePasswordService = updatePasswordService;
        this.schemaValidator = schemaValidator;
        this.usersSchema = usersSchema;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ email, password }: UpdatePasswordPayload): Promise<void> {
        this.logger('info', 'Execute - UpdatePasswordOperation');
        await this.updatePasswordService.update({ email, password });
    }
}
