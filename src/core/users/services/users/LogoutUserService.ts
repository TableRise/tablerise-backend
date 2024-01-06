import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class LogoutUserService {
    private readonly _tokenForbideen;
    private readonly _logger;

    constructor({
        tokenForbidden,
        logger,
    }: UserCoreDependencies['logoutUserServiceContract']) {
        this._tokenForbideen = tokenForbidden;
        this._logger = logger;

        this.addToForbiddenList = this.addToForbiddenList.bind(this);
    }

    async addToForbiddenList(token: string): Promise<void> {
        this._logger('info', 'AddToForbiddenList - LogoutUserService');
        await this._tokenForbideen.addToken(token);
    }
}
