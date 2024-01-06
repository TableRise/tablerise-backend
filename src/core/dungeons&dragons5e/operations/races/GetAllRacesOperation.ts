import { Race } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllRacesOperationContract } from 'src/types/modules/core/dungeons&dragons5e/races/GetAllRaces';

export default class GetAllRacesOperation {
    private readonly _getAllRacesService;
    private readonly _logger;

    constructor({ getAllRacesService, logger }: GetAllRacesOperationContract) {
        this._getAllRacesService = getAllRacesService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Race>>> {
        this._logger('info', 'Execute - GetAllRacesOperation');
        const races = await this._getAllRacesService.getAll();

        return races;
    }
}
