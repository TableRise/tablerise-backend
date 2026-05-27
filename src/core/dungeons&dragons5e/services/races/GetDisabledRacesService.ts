import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledRacesServiceContract } from 'src/types/modules/core/dungeons&dragons5e/races/GetDisabledRaces';

export default class GetDisabledRacesService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledRacesServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Race>>> {
        const callName = `[${this.constructor.name}] - ${this.getAllDisabled.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Races');

        const racesInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Race>>;

        return racesInDb;
    }
}
