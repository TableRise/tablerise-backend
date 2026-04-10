import { Realm } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleRealmsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/realms/ToggleRealmsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleRealmsAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleRealmsAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Realm>> {
        this.logger('info', 'Toggle - ToggleRealmsAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('Realms');

        const realmInDb = (await this.dungeonsAndDragonsRepository.findOne({
            realmId: id,
        })) as Internacional<Realm>;

        realmInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { realmId: id },
            payload: realmInDb,
        });

        return realmInDb;
    }
}
