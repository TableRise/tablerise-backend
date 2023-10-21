import { ActivateTwoFactorOperationContract } from 'src/types/contracts/users/ActivateTwoFactor';
import { TwoFactorResponse } from 'src/types/requests/Response';

export default class ActivateTwoFactorOperation extends ActivateTwoFactorOperationContract {
    constructor({ activateTwoFactorService, logger }: ActivateTwoFactorOperationContract) {
        super();
        this.activateTwoFactorService = activateTwoFactorService;
        this.logger = logger;
    }

    public async execute(userId: string): Promise<TwoFactorResponse> {
        this.logger('info', '[Execute - ActivateTwoFactorOperation]');
        const twoFactorActivated = await this.activateTwoFactorService.activate(userId);
        return twoFactorActivated;
    }
}
