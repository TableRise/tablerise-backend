import { UpdateEmailOperationContract } from 'src/types/contracts/users/UpdateEmail';
import { UpdateEmailPayload } from 'src/types/requests/Payload';

export default class UpdateEmailOperation extends UpdateEmailOperationContract {
    constructor({ usersSchema, updateEmailService, schemaValidator, logger }: UpdateEmailOperationContract) {
        super();
        this.updateEmailService = updateEmailService;
        this.schemaValidator = schemaValidator;
        this.usersSchema = usersSchema;
        this.logger = logger;
    }

    public async execute({ userId, code, email }: UpdateEmailPayload): Promise<void> {
        this.logger('info', '[Execute - UpdateEmailOperation]');
        this.schemaValidator.entry(this.usersSchema.emailUpdateZod, { email });
        await this.updateEmailService.update({ userId, code, email });
    }
}