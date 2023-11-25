import { Background } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleBackgroundsAvailabilityServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/backgrounds/ToggleBackgroundsAvailability';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

export default class ToggleBackgroundsAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: ToggleBackgroundsAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Background>> {
        this._logger('info', 'Toggle - ToggleBackgroundsAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('Backgrounds');

        const backgroundInDb = (await this._dungeonsAndDragonsRepository.findOne({
            backgroundId: id,
        })) as Internacional<Background>;

        backgroundInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { backgroundId: id },
            payload: backgroundInDb,
        });

        return backgroundInDb;
    }
}
