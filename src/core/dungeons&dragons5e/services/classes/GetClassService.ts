import { Class } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetClassServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/classes/GetClass';

export default class GetClassService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetClassServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Class>> {
        this._logger('info', 'GetAll - GetClassService');
        this._dungeonsAndDragonsRepository.setEntity('Classes');

        const classInDb = (await this._dungeonsAndDragonsRepository.findOne({
            classId: id,
        })) as Internacional<Class>;
        return classInDb;
    }
}
