import { Weapon } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleWeaponsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/ToggleWeaponsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleWeaponsAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleWeaponsAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Weapon>> {
        this.logger('info', 'Toggle - ToggleWeaponsAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('Weapons');

        const weaponInDb = (await this.dungeonsAndDragonsRepository.findOne({
            weaponId: id,
        })) as Internacional<Weapon>;

        weaponInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { weaponId: id },
            payload: weaponInDb,
        });

        return weaponInDb;
    }
}
