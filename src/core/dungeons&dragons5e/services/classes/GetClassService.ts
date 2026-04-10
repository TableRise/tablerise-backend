import { Class } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetClassServiceContract } from 'src/types/modules/core/dungeons&dragons5e/classes/GetClass';

export default class GetClassService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetClassServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Class>> {
        this.logger('info', 'GetAll - GetClassService');
        this.dungeonsAndDragonsRepository.setEntity('Classes');

        const classInDb = (await this.dungeonsAndDragonsRepository.findOne({
            classId: id,
        })) as Internacional<Class>;
        return classInDb;
    }
}
