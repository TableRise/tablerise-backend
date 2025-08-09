import { Race } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleRacesAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/races/ToggleRacesAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleRacesAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleRacesAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Race>> {
        this._logger('info', 'Toggle - ToggleRacesAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('Races');

        const raceInDb = (await this._dungeonsAndDragonsRepository.findOne({
            raceId: id,
        })) as Internacional<Race>;

        raceInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { raceId: id },
            payload: raceInDb,
        });

        return raceInDb;
    }
}
