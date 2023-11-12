import { Race } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetAllRacesServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/races/GetAllRaces';

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
