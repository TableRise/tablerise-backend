import { Wiki } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetDisabledWikisOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/wikis/GetDisabledWikis';

export default class GetDisabledWikisOperation {
    private readonly _getDisabledWikisService;
    private readonly _logger;

    constructor({ getDisabledWikisService, logger }: GetDisabledWikisOperationContract) {
        this._getDisabledWikisService = getDisabledWikisService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Wiki>>> {
        this._logger('info', 'Execute - GetDisabledWikisOperation');
        const wikis = await this._getDisabledWikisService.getAllDisabled();
        return wikis;
    }
}
