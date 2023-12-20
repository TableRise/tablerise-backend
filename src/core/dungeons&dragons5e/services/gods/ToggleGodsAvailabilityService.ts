import { God } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleGodsAvailabilityServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/gods/ToggleGodsAvailabilityService';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

export default class ToggleGodsAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: ToggleGodsAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<God>> {
        this._logger('info', 'Toggle - ToggleGodsAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('Gods');

        const godInDb = (await this._dungeonsAndDragonsRepository.findOne({
            godId: id,
        })) as Internacional<God>;

        godInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { godId: id },
            payload: godInDb,
        });

        return godInDb;
    }
}
