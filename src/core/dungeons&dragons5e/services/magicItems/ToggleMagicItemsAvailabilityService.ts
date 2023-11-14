import { MagicItem } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { ToggleMagicItemsAvailabilityServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/magicItems/ToggleMagicItemsAvailability';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

export default class ToggleMagicItemsAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: ToggleMagicItemsAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<MagicItem>> {
        this._logger('info', 'Toggle - ToggleMagicItemsAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('MagicItems');

        const magicItemInDb = (await this._dungeonsAndDragonsRepository.findOne({
            magicItemId: id,
        })) as Internacional<MagicItem>;

        magicItemInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { magicItemId: id },
            payload: magicItemInDb,
        });

        return magicItemInDb;
    }
}
