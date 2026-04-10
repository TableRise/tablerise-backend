import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledRacesOperationContract } from 'src/types/modules/core/dungeons&dragons5e/races/GetDisabledRaces';

export default class GetDisabledRacesOperation {
    private readonly getDisabledRacesService;
    private readonly logger;

    constructor({ getDisabledRacesService, logger }: GetDisabledRacesOperationContract) {
        this.getDisabledRacesService = getDisabledRacesService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Race>>> {
        this.logger('info', 'Execute - GetDisabledRacesOperation');
        const races = await this.getDisabledRacesService.getAllDisabled();

        return races;
    }
}
