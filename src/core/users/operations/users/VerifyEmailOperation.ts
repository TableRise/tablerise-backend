import { VerifyEmailOperationContract } from 'src/types/contracts/users/VerifyEmail';
import { VerifyEmailPayload } from 'src/types/requests/Payload';

export default class VerifyEmailOperation {
    private readonly _logger;
    private readonly _verifyEmailService;

    constructor({ verifyEmailService, logger }: VerifyEmailOperationContract) {
        this._logger = logger;
        this._verifyEmailService = verifyEmailService;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, email }: VerifyEmailPayload): Promise<void> {
        this._logger('info', 'Execute - VerifyEmailOperation');
        await this._verifyEmailService.sendEmail({ userId, email });
    }
}
