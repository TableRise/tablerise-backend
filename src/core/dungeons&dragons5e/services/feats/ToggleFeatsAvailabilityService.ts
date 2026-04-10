import { Feat } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleFeatsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/feats/ToggleFeatsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleFeatsAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleFeatsAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Feat>> {
        this.logger('info', 'Toggle - ToggleFeatsAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('Feats');

        const featInDb = (await this.dungeonsAndDragonsRepository.findOne({
            featId: id,
        })) as Internacional<Feat>;

        featInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { featId: id },
            payload: featInDb,
        });

        return featInDb;
    }
}
