import { Monster } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleMonstersAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/ToggleMonstersAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleMonstersAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleMonstersAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Monster>> {
        this.logger('info', 'Toggle - ToggleMonstersAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('Monsters');

        const monsterInDb = (await this.dungeonsAndDragonsRepository.findOne({
            monsterId: id,
        })) as Internacional<Monster>;

        monsterInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { monsterId: id },
            payload: monsterInDb,
        });

        return monsterInDb;
    }
}
