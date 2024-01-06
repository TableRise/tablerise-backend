import { Race } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetRaceOperationContract } from 'src/types/modules/core/dungeons&dragons5e/races/GetRace';

export default class GetRaceOperation {
    private readonly _getRaceService;
    private readonly _logger;

    constructor({ getRaceService, logger }: GetRaceOperationContract) {
        this._getRaceService = getRaceService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Race>> {
        this._logger('info', 'Execute - GetRaceOperation');
        const race = await this._getRaceService.get(id);

        return race;
    }
}
