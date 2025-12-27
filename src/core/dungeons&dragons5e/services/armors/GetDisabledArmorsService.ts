import { Armor } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledArmorsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/armors/GetDisabledArmors';

export default class GetDisabledArmorsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledArmorsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Armor>>> {
        this.logger('info', 'GetAll - GetDisabledArmorsService');
        this.dungeonsAndDragonsRepository.setEntity('Armors');

        const armorInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Armor>>;
        return armorInDb;
    }
}
