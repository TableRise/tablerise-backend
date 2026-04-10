import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { TwoFactorResponse } from 'src/types/api/users/http/response';

export default class ActivateTwoFactorOperation {
    private readonly activateTwoFactorService;
    private readonly logger;

    constructor({ activateTwoFactorService, logger }: UserCoreDependencies['activateTwoFactorOperationContract']) {
        this.activateTwoFactorService = activateTwoFactorService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<TwoFactorResponse> {
        this.logger('info', 'Execute - ActivateTwoFactorOperation');

        const { user, userDetails } = await this.activateTwoFactorService.activate(userId);

        return this.activateTwoFactorService.save({
            user,
            userDetails,
        });
    }
}
