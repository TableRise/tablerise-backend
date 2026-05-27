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
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        await this.logoutUserService.addToForbiddenList(token);
    }
}
