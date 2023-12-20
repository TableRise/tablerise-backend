import { Armor } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleArmorsAvailabilityServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/armors/ToggleArmorsAvailabilityService';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

export default class ToggleArmorsAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: ToggleArmorsAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Armor>> {
        this._logger('info', 'Toggle - ToggleArmorsAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('Armors');

        const armorInDb = (await this._dungeonsAndDragonsRepository.findOne({
            armorId: id,
        })) as Internacional<Armor>;

        armorInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { armorId: id },
            payload: armorInDb,
        });

        return armorInDb;
    }
}
