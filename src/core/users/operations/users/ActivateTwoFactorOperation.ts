import { ActivateTwoFactorOperationContract } from 'src/types/users/contracts/core/ActivateTwoFactor';
import { TwoFactorResponse } from 'src/types/users/requests/Response';

export default class ActivateTwoFactorOperation {
    private readonly _activateTwoFactorService;
    private readonly _logger;

    constructor({
        activateTwoFactorService,
        logger,
    }: ActivateTwoFactorOperationContract) {
        this._activateTwoFactorService = activateTwoFactorService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string, isReset: boolean): Promise<TwoFactorResponse> {
        this._logger('info', 'Execute - ActivateTwoFactorOperation');

        const { user, userDetails } = await this._activateTwoFactorService.activate(
            userId,
            isReset
        );
        const twoFactor = await this._activateTwoFactorService.save({
            user,
            userDetails,
        });
        return twoFactor;
    }
}
