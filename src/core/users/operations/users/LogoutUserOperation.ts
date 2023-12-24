import { LogoutUserOperationContract } from 'src/types/users/contracts/core/LogoutUser';

export default class LogoutUserOperation {
    private readonly _logoutUserService;
    private readonly _logger;

    constructor({ logoutUserService, logger }: LogoutUserOperationContract) {
        this._logoutUserService = logoutUserService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(token: string): Promise<void> {
        this._logger('info', 'Execute - LogoutUserOperation');
        await this._logoutUserService.addToForbiddenList(token);
    }
}
