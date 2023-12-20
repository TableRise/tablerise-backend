import { Class } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledClassesOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/classes/GetDisabledClasses';

export default class GetDisabledClassesOperation {
    private readonly _getDisabledClassesService;
    private readonly _logger;

    constructor({
        getDisabledClassesService,
        logger,
    }: GetDisabledClassesOperationContract) {
        this._getDisabledClassesService = getDisabledClassesService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Class>>> {
        this._logger('info', 'Execute - GetClassOperation');
        const classes = await this._getDisabledClassesService.getAllDisabled();
        return classes;
    }
}
