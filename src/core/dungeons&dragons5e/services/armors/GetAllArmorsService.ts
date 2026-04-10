import { Armor } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllArmorsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/armors/GetAllArmors';

export default class GetAllArmorsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllArmorsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Armor>>> {
        this.logger('info', 'GetAll - GetAllArmorsService');
        this.dungeonsAndDragonsRepository.setEntity('Armors');

        const armorsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Armor>>;
        return armorsInDb;
    }
}
