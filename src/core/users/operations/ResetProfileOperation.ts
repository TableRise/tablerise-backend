import { ResetProfileOperationContract } from 'src/types/contracts/users/ResetProfile';

export default class ResetProfileOperation {
    private readonly _resetProfileService;
    private readonly _logger;

    constructor({ resetProfileService, logger }: ResetProfileOperationContract) {
        this._resetProfileService = resetProfileService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<void> {
        this._logger('info', 'Execute - ResetProfileOperation');
        await this._resetProfileService.reset(userId);
    }
}
