import { LogoutUserServiceContract } from 'src/types/users/contracts/core/LogoutUser';

export default class LogoutUserService {
    private readonly _tokenForbideen;
    private readonly _logger;

    constructor({ tokenForbidden, logger }: LogoutUserServiceContract) {
        this._tokenForbideen = tokenForbidden;
        this._logger = logger;

        this.addToForbiddenList = this.addToForbiddenList.bind(this);
    }

    async addToForbiddenList(token: string): Promise<void> {
        this._logger('info', 'AddToForbiddenList - LogoutUserService');
        await this._tokenForbideen.addToken(token);
    }
}
