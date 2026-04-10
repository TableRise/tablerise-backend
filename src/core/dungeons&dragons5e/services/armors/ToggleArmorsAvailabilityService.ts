import { Armor } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleArmorsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/armors/ToggleArmorsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleArmorsAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleArmorsAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Armor>> {
        this.logger('info', 'Toggle - ToggleArmorsAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('Armors');

        const armorInDb = (await this.dungeonsAndDragonsRepository.findOne({
            armorId: id,
        })) as Internacional<Armor>;

        armorInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { armorId: id },
            payload: armorInDb,
        });

        return armorInDb;
    }
}
