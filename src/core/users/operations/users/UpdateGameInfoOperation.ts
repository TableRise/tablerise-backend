import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateGameInfoPayload } from 'src/types/api/users/http/payload';

export default class UpdateGameInfoOperation {
    private readonly _updateGameInfoService;
    private readonly _logger;

    constructor({ updateGameInfoService, logger }: UserCoreDependencies['updateGameInfoOperationContract']) {
        this._updateGameInfoService = updateGameInfoService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: UpdateGameInfoPayload): Promise<string> {
        this._logger('info', 'Execute - UpdateGameInfoOperation');
        return this._updateGameInfoService.update(payload);
    }
}
