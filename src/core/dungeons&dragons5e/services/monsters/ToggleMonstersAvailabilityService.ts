import { Monster } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleMonstersAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/ToggleMonstersAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleMonstersAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: ToggleMonstersAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Monster>> {
        this._logger('info', 'Toggle - ToggleMonstersAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('Monsters');

        const monsterInDb = (await this._dungeonsAndDragonsRepository.findOne({
            monsterId: id,
        })) as Internacional<Monster>;

        monsterInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { monsterId: id },
            payload: monsterInDb,
        });

        return monsterInDb;
    }
}
