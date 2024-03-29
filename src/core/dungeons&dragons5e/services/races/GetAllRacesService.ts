import { Race } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllRacesServiceContract } from 'src/types/modules/core/dungeons&dragons5e/races/GetAllRaces';

export default class GetAllRacesService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllRacesServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Race>>> {
        this._logger('info', 'GetAll - GetAllRacesService');
        this._dungeonsAndDragonsRepository.setEntity('Races');

        const racesInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Race>>;

        return racesInDb;
    }
}
