import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { VerifyEmailPayload } from 'src/types/api/users/http/payload';

export default class VerifyEmailOperation {
    private readonly _logger;
    private readonly _verifyEmailService;

    constructor({
        verifyEmailService,
        logger,
    }: UserCoreDependencies['verifyEmailOperationContract']) {
        this._logger = logger;
        this._verifyEmailService = verifyEmailService;

        this.execute = this.execute.bind(this);
    }

    public async execute({ email, newEmail }: VerifyEmailPayload): Promise<void> {
        this._logger('info', 'Execute - VerifyEmailOperation');
        await this._verifyEmailService.sendEmail({ email, newEmail });
    }
}
