import { Class } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledClassesServiceContract } from 'src/types/modules/core/dungeons&dragons5e/classes/GetDisabledClasses';

export default class GetDisabledClassesService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledClassesServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Class>>> {
        const callName = `[${this.constructor.name}] - ${this.getAllDisabled.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Classes');

        const classInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Class>>;
        return classInDb;
    }
}
