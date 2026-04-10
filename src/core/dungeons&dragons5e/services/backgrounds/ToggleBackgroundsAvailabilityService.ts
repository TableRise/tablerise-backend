import { Background } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleBackgroundsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/ToggleBackgroundsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleBackgroundsAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleBackgroundsAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Background>> {
        this.logger('info', 'Toggle - ToggleBackgroundsAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('Backgrounds');

        const backgroundInDb = (await this.dungeonsAndDragonsRepository.findOne({
            backgroundId: id,
        })) as Internacional<Background>;

        backgroundInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { backgroundId: id },
            payload: backgroundInDb,
        });

        return backgroundInDb;
    }
}
