import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllRacesOperationContract } from 'src/types/modules/core/dungeons&dragons5e/races/GetAllRaces';

export default class GetAllRacesOperation {
    private readonly getAllRacesService;
    private readonly logger;

    constructor({ getAllRacesService, logger }: GetAllRacesOperationContract) {
        this.getAllRacesService = getAllRacesService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Race>>> {
        this.logger('info', 'Execute - GetAllRacesOperation');
        const races = await this.getAllRacesService.getAll();

        return races;
    }
}
