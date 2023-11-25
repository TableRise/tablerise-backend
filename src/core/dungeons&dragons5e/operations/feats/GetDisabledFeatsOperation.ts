import { Feat } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledFeatsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/feats/GetDisabledFeats';

export default class GetDisabledFeatsOperation {
    private readonly _getDisabledFeatsService;
    private readonly _logger;

    constructor({ getDisabledFeatsService, logger }: GetDisabledFeatsOperationContract) {
        this._getDisabledFeatsService = getDisabledFeatsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Feat>>> {
        this._logger('info', 'Execute - GetFeatOperation');
        const feats = await this._getDisabledFeatsService.getAllDisabled();
        return feats;
    }
}
