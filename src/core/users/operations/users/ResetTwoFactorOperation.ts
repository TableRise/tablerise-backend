import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { TwoFactorResponse } from 'src/types/api/users/http/response';

export default class ResetTwoFactorOperation {
    private readonly _resetTwoFactorService;
    private readonly _logger;

    constructor({
        resetTwoFactorService,
        logger,
    }: UserCoreDependencies['resetTwoFactorOperationContract']) {
        this._resetTwoFactorService = resetTwoFactorService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<TwoFactorResponse> {
        this._logger('info', 'Execute - ResetTwoFactorOperation');

        const user2FAReseted = await this._resetTwoFactorService.reset(userId);

        return this._resetTwoFactorService.save(user2FAReseted);
    }
}
