import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class LogoutUserOperation {
    private readonly _logoutUserService;
    private readonly _logger;

    constructor({ logoutUserService, logger }: UserCoreDependencies['logoutUserOperationContract']) {
        this._logoutUserService = logoutUserService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(token: string): Promise<void> {
        this._logger('info', 'Execute - LogoutUserOperation');
        await this._logoutUserService.addToForbiddenList(token);
    }
}
