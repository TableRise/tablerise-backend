import { God } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledGodsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/gods/GetDisabledGodsOperation';

export default class GetDisabledGodsOperation {
    private readonly _getDisabledGodsService;
    private readonly _logger;

    constructor({ getDisabledGodsService, logger }: GetDisabledGodsOperationContract) {
        this._getDisabledGodsService = getDisabledGodsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<God>>> {
        this._logger('info', 'Execute - GetGodOperation');
        const gods = await this._getDisabledGodsService.getAllDisabled();
        return gods;
    }
}
