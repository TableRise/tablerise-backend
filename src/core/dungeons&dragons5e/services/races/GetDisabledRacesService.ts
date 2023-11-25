import { Race } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledRacesServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/races/GetDisabledRaces';

export default class GetDisabledRacesService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: GetDisabledRacesServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Race>>> {
        this._logger('info', 'getAllDisabled - getDisabledRacesService');
        this._dungeonsAndDragonsRepository.setEntity('Races');

        const racesInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Race>>;

        return racesInDb;
    }
}
