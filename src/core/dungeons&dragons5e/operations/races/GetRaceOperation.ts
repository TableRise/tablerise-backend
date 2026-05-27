import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetRaceOperationContract } from 'src/types/modules/core/dungeons&dragons5e/races/GetRace';

export default class GetRaceOperation {
    private readonly getRaceService;
    private readonly logger;

    constructor({ getRaceService, logger }: GetRaceOperationContract) {
        this.getRaceService = getRaceService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Race>> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const race = await this.getRaceService.get(id);

        return race;
    }
}
