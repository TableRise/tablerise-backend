import { God } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetGodOperationContract } from 'src/types/modules/core/dungeons&dragons5e/gods/GetGodOperation';

export default class GetGodOperation {
    private readonly _getGodService;
    private readonly _logger;

    constructor({ getGodService, logger }: GetGodOperationContract) {
        this._getGodService = getGodService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<God>> {
        this._logger('info', 'Execute - GetGodOperation');
        const god = await this._getGodService.get(id);
        return god;
    }
}
