import { Realm } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleRealmsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/realms/ToggleRealmsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleRealmsAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: ToggleRealmsAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Realm>> {
        this._logger('info', 'Toggle - ToggleRealmsAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('Realms');

        const realmInDb = (await this._dungeonsAndDragonsRepository.findOne({
            realmId: id,
        })) as Internacional<Realm>;

        realmInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { realmId: id },
            payload: realmInDb,
        });

        return realmInDb;
    }
}
