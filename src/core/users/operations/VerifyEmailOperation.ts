import { VerifyEmailOperationContract } from "src/types/contracts/users/VerifyEmail";

export default class VerifyEmailOperation extends VerifyEmailOperationContract {
    constructor({ verifyEmailService, logger }: VerifyEmailOperationContract) {
        super();
        this.logger = logger;
        this.verifyEmailService = verifyEmailService;
    }

    public async execute(userId: string): Promise<void> {
        this.logger('info', '[Execute - VerifyEmailOperation]');
        await this.verifyEmailService.sendEmail(userId);
    }
}
