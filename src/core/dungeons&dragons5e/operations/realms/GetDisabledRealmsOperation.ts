import { Realm } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledRealmsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/realms/GetDisabledRealms';

export default class GetDisabledRealmsOperation {
    private readonly _getDisabledRealmsService;
    private readonly _logger;

    constructor({
        getDisabledRealmsService,
        logger,
    }: GetDisabledRealmsOperationContract) {
        this._getDisabledRealmsService = getDisabledRealmsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Realm>>> {
        this._logger('info', 'Execute - GetDisabledRealmsOperation');
        const realms = await this._getDisabledRealmsService.getAllDisabled();

        return realms;
    }
}
