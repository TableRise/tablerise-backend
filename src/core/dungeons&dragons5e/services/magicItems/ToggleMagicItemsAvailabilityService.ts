import { MagicItem } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleMagicItemsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/magicItems/ToggleMagicItemsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleMagicItemsAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleMagicItemsAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<MagicItem>> {
        this.logger('info', 'Toggle - ToggleMagicItemsAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('MagicItems');

        const magicItemInDb = (await this.dungeonsAndDragonsRepository.findOne({
            magicItemId: id,
        })) as Internacional<MagicItem>;

        magicItemInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { magicItemId: id },
            payload: magicItemInDb,
        });

        return magicItemInDb;
    }
}
