import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetRaceServiceContract } from 'src/types/modules/core/dungeons&dragons5e/races/GetRace';

export default class GetRaceService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetRaceServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Race>> {
        this.logger('info', 'Get - GetRaceService');
        this.dungeonsAndDragonsRepository.setEntity('Races');

        const raceInDb = (await this.dungeonsAndDragonsRepository.findOne({
            raceId: id,
        })) as Internacional<Race>;

        return raceInDb;
    }
}
