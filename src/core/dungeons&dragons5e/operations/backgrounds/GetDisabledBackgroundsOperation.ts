import { Background } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetDisabledBackgroundsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/backgrounds/GetDisabledBackgrounds';

export default class GetDisabledBackgroundsOperation {
    private readonly _getDisabledBackgroundsService;
    private readonly _logger;

    constructor({
        getDisabledBackgroundsService,
        logger,
    }: GetDisabledBackgroundsOperationContract) {
        this._getDisabledBackgroundsService = getDisabledBackgroundsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Background>>> {
        this._logger('info', 'Execute - GetBackgroundOperation');
        const backgrounds = await this._getDisabledBackgroundsService.getAllDisabled();
        return backgrounds;
    }
}
