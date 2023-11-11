import { Race } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetDisabledRacesOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/races/GetDisabledRaces';

export default class GetDisabledRacesOperation {
    private readonly _getDisabledRacesService;
    private readonly _logger;

    constructor({ getDisabledRacesService, logger }: GetDisabledRacesOperationContract) {
        this._getDisabledRacesService = getDisabledRacesService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Race>>> {
        this._logger('info', 'Execute - GetDisabledRacesOperation');
        const races = await this._getDisabledRacesService.getAllDisabled();

        return races;
    }
}
