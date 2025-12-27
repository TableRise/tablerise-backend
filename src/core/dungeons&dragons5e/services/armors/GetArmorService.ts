import { Armor } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetArmorServiceContract } from 'src/types/modules/core/dungeons&dragons5e/armors/GetArmor';

export default class GetArmorService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetArmorServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Armor>> {
        this.logger('info', 'GetAll - GetArmorService');
        this.dungeonsAndDragonsRepository.setEntity('Armors');

        const armorInDb = (await this.dungeonsAndDragonsRepository.findOne({
            armorId: id,
        })) as Internacional<Armor>;
        return armorInDb;
    }
}
