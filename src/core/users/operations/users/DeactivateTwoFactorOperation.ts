import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class DeactivateTwoFactorOperation {
    private readonly deactivateTwoFactorService;
    private readonly logger;

    constructor({ deactivateTwoFactorService, logger }: UserCoreDependencies['deactivateTwoFactorOperationContract']) {
        this.deactivateTwoFactorService = deactivateTwoFactorService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const userWithInactiveTwoFactor = await this.deactivateTwoFactorService.deactivate(userId);

        await this.deactivateTwoFactorService.save(userWithInactiveTwoFactor);
    }
}
