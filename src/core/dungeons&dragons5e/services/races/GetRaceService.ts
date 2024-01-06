import { Race } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetRaceServiceContract } from 'src/types/modules/core/dungeons&dragons5e/races/GetRace';

export default class GetRaceService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetRaceServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Race>> {
        this._logger('info', 'Get - GetRaceService');
        this._dungeonsAndDragonsRepository.setEntity('Races');

        const raceInDb = (await this._dungeonsAndDragonsRepository.findOne({
            raceId: id,
        })) as Internacional<Race>;

        return raceInDb;
    }
}
