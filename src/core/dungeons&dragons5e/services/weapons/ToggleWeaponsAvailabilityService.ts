import { Weapon } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleWeaponsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/ToggleWeaponsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleWeaponsAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: ToggleWeaponsAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Weapon>> {
        this._logger('info', 'Toggle - ToggleWeaponsAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('Weapons');

        const weaponInDb = (await this._dungeonsAndDragonsRepository.findOne({
            weaponId: id,
        })) as Internacional<Weapon>;

        weaponInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { weaponId: id },
            payload: weaponInDb,
        });

        return weaponInDb;
    }
}
