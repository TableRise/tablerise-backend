import { ResetTwoFactorOperationContract } from 'src/types/contracts/users/ResetTwoFactor';
import { ConfirmCodePayload } from 'src/types/requests/Payload';
import { TwoFactorResponse } from 'src/types/requests/Response';

export default class ResetTwoFactorOperation extends ResetTwoFactorOperationContract {
    constructor({ resetTwoFactorService, logger }: ResetTwoFactorOperationContract) {
        super();
        this.resetTwoFactorService = resetTwoFactorService;
        this.logger = logger;
    }

    public async execute({ userId, code }: ConfirmCodePayload): Promise<TwoFactorResponse> {
        this.logger('info', '[Execute - ResetTwoFactorOperation]');
        const twoFactorReset = await this.resetTwoFactorService.reset({ userId, code });
        return twoFactorReset;
    }
}
