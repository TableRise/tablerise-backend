import { Background } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetBackgroundOperationContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/GetBackground';

export default class GetBackgroundOperation {
    private readonly _getBackgroundService;
    private readonly _logger;

    constructor({ getBackgroundService, logger }: GetBackgroundOperationContract) {
        this._getBackgroundService = getBackgroundService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Background>> {
        this._logger('info', 'Execute - GetBackgroundOperation');
        const background = await this._getBackgroundService.get(id);
        return background;
    }
}
