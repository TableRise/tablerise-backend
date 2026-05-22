import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllRacesServiceContract } from 'src/types/modules/core/dungeons&dragons5e/races/GetAllRaces';

export default class GetAllRacesService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllRacesServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Race>>> {
        const callName = `[${this.constructor.name}] - ${this.getAll.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Races');

        const racesInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Race>>;

        return racesInDb;
    }
}
