import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { TwoFactorResponse } from 'src/types/users/requests/Response';

export default class ActivateTwoFactorOperation {
    private readonly _activateTwoFactorService;
    private readonly _logger;

    constructor({
        activateTwoFactorService,
        logger,
    }: UserCoreDependencies['activateTwoFactorOperationContract']) {
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
