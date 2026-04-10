import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleRacesAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/races/ToggleRacesAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleRacesAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleRacesAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Race>> {
        this.logger('info', 'Toggle - ToggleRacesAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('Races');

        const raceInDb = (await this.dungeonsAndDragonsRepository.findOne({
            raceId: id,
        })) as Internacional<Race>;

        raceInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { raceId: id },
            payload: raceInDb,
        });

        return raceInDb;
    }
}
