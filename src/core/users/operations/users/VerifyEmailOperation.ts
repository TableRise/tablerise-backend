import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { TValidateEmailSendCodeQuery } from 'src/interface/users/presentation/users/UsersSchemas';

export default class VerifyEmailOperation {
    private readonly _logger;
    private readonly _verifyEmailService;

    constructor({ verifyEmailService, logger }: UserCoreDependencies['verifyEmailOperationContract']) {
        this._logger = logger;
        this._verifyEmailService = verifyEmailService;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: TValidateEmailSendCodeQuery): Promise<void> {
        this._logger('info', 'Execute - VerifyEmailOperation');
        await this._verifyEmailService.sendEmail(payload);
    }
}
