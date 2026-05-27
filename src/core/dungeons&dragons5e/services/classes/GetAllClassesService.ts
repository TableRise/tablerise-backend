import { Class } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllClassesServiceContract } from 'src/types/modules/core/dungeons&dragons5e/classes/GetAllClasses';

export default class GetAllClassesService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllClassesServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Class>>> {
        const callName = `[${this.constructor.name}] - ${this.getAll.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Classes');

        const classesInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Class>>;
        return classesInDb;
    }
}
