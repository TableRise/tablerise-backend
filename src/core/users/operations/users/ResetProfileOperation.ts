import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class ResetProfileOperation {
    private readonly resetProfileService;
    private readonly logger;

    constructor({ resetProfileService, logger }: UserCoreDependencies['resetProfileOperationContract']) {
        this.resetProfileService = resetProfileService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        await this.resetProfileService.reset(userId);
    }
}
