import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateGameInfoPayload } from 'src/types/api/users/http/payload';

export default class UpdateGameInfoOperation {
    private readonly updateGameInfoService;
    private readonly logger;

    constructor({ updateGameInfoService, logger }: UserCoreDependencies['updateGameInfoOperationContract']) {
        this.updateGameInfoService = updateGameInfoService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: UpdateGameInfoPayload): Promise<string> {
        this.logger('info', 'Execute - UpdateGameInfoOperation');
        return this.updateGameInfoService.update(payload);
    }
}
