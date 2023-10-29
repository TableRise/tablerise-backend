import { ResetTwoFactorOperationContract } from 'src/types/users/contracts/core/ResetTwoFactor';
import { ConfirmCodePayload } from 'src/types/requests/Payload';
import { TwoFactorResponse } from 'src/types/requests/Response';

export default class ResetTwoFactorOperation {
    private readonly _resetTwoFactorService;
    private readonly _logger;

    constructor({ resetTwoFactorService, logger }: ResetTwoFactorOperationContract) {
        this._resetTwoFactorService = resetTwoFactorService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        userId,
        code,
    }: ConfirmCodePayload): Promise<TwoFactorResponse> {
        this._logger('info', 'Execute - ResetTwoFactorOperation');
        const twoFactorReset = await this._resetTwoFactorService.reset({ userId, code });
        return twoFactorReset;
    }
}
