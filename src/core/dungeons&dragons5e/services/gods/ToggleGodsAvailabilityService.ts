import { God } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleGodsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/gods/ToggleGodsAvailabilityService';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleGodsAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleGodsAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<God>> {
        this.logger('info', 'Toggle - ToggleGodsAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('Gods');

        const godInDb = (await this.dungeonsAndDragonsRepository.findOne({
            godId: id,
        })) as Internacional<God>;

        godInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { godId: id },
            payload: godInDb,
        });

        return godInDb;
    }
}
