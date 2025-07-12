import { Feat } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleFeatsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/feats/ToggleFeatsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleFeatsAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleFeatsAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Feat>> {
        this._logger('info', 'Toggle - ToggleFeatsAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('Feats');

        const featInDb = (await this._dungeonsAndDragonsRepository.findOne({
            featId: id,
        })) as Internacional<Feat>;

        featInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { featId: id },
            payload: featInDb,
        });

        return featInDb;
    }
}
