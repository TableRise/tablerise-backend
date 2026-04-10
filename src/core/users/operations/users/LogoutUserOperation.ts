import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class LogoutUserOperation {
    private readonly logoutUserService;
    private readonly logger;

    constructor({ logoutUserService, logger }: UserCoreDependencies['logoutUserOperationContract']) {
        this.logoutUserService = logoutUserService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(token: string): Promise<void> {
        this.logger('info', 'Execute - LogoutUserOperation');
        await this.logoutUserService.addToForbiddenList(token);
    }
}
