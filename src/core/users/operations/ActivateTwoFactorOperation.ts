import { ActivateTwoFactorOperationContract } from 'src/types/contracts/users/ActivateTwoFactor';
import { TwoFactorResponse } from 'src/types/requests/Response';

export default class ActivateTwoFactorOperation {
    private readonly _activateTwoFactorService;
    private readonly _logger;

    constructor({ activateTwoFactorService, logger }: ActivateTwoFactorOperationContract) {
        this._activateTwoFactorService = activateTwoFactorService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<TwoFactorResponse> {
        this._logger('info', 'Execute - ActivateTwoFactorOperation');
        const twoFactorActivated = await this._activateTwoFactorService.activate(userId);
        return twoFactorActivated;
    }
}
