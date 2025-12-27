import { Wiki } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleWikisAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/wikis/ToggleWikisAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleWikisAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleWikisAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Wiki>> {
        this.logger('info', 'Toggle - ToggleWikisAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('Wikis');

        const wikiInDb = (await this.dungeonsAndDragonsRepository.findOne({
            wikiId: id,
        })) as Internacional<Wiki>;

        wikiInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { wikiId: id },
            payload: wikiInDb,
        });

        return wikiInDb;
    }
}
