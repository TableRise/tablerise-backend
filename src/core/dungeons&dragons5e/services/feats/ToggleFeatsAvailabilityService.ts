import { Feat } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { ToggleFeatsAvailabilityServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/feats/ToggleFeatsAvailability';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

export default class ToggleFeatsAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: ToggleFeatsAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Feat>> {
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
