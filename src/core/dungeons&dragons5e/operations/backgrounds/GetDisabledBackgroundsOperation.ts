import { Background } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledBackgroundsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/GetDisabledBackgrounds';

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
