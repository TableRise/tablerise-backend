import { RegisterDonationPayload } from 'src/types/api/users/http/payload';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class RegisterDonationOperation {
    private readonly logger;
    private readonly registerDonationService;

    constructor({ registerDonationService, logger }: UserCoreDependencies['registerDonationOperationContract']) {
        this.logger = logger;
        this.registerDonationService = registerDonationService;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: RegisterDonationPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        await this.registerDonationService.register(payload);
    }
}
