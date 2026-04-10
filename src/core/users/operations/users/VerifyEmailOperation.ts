import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { TValidateEmailSendCodeQuery } from 'src/interface/users/presentation/users/UsersSchemas';

export default class VerifyEmailOperation {
    private readonly logger;
    private readonly verifyEmailService;

    constructor({ verifyEmailService, logger }: UserCoreDependencies['verifyEmailOperationContract']) {
        this.logger = logger;
        this.verifyEmailService = verifyEmailService;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: TValidateEmailSendCodeQuery): Promise<void> {
        this.logger('info', 'Execute - VerifyEmailOperation');
        await this.verifyEmailService.sendEmail(payload);
    }
}
