import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class LogoutUserService {
    private readonly tokenForbideen;
    private readonly logger;

    constructor({ tokenForbidden, logger }: UserCoreDependencies['logoutUserServiceContract']) {
        this.tokenForbideen = tokenForbidden;
        this.logger = logger;

        this.addToForbiddenList = this.addToForbiddenList.bind(this);
    }

    async addToForbiddenList(token: string): Promise<void> {
        this.logger('info', 'AddToForbiddenList - LogoutUserService');
        await this.tokenForbideen.addToken(token);
    }
}
