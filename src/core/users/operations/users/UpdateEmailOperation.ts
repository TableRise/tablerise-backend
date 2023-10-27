import { UpdateEmailOperationContract } from 'src/types/contracts/users/core/UpdateEmail';
import { UpdateEmailPayload } from 'src/types/requests/Payload';

export default class UpdateEmailOperation {
    private readonly _updateEmailService;
    private readonly _schemaValidator;
    private readonly _usersSchema;
    private readonly _logger;

    constructor({
        usersSchema,
        updateEmailService,
        schemaValidator,
        logger,
    }: UpdateEmailOperationContract) {
        this._updateEmailService = updateEmailService;
        this._schemaValidator = schemaValidator;
        this._usersSchema = usersSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, code, email }: UpdateEmailPayload): Promise<void> {
        this._logger('info', 'Execute - UpdateEmailOperation');
        this._schemaValidator.entry(this._usersSchema.emailUpdateZod, { email });
        await this._updateEmailService.update({ userId, code, email });
    }
}
