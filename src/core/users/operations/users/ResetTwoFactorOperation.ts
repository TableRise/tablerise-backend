import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { TwoFactorResponse } from 'src/types/api/users/http/response';

export default class ResetTwoFactorOperation {
    private readonly resetTwoFactorService;
    private readonly logger;

    constructor({ resetTwoFactorService, logger }: UserCoreDependencies['resetTwoFactorOperationContract']) {
        this.resetTwoFactorService = resetTwoFactorService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<TwoFactorResponse> {
        this.logger('info', 'Execute - ResetTwoFactorOperation');

        const user2FAReseted = await this.resetTwoFactorService.reset(userId);

        return this.resetTwoFactorService.save(user2FAReseted);
    }
}
