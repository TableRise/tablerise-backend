import { Class } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetAllClassesServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/classes/GetAllClasses';

export default class GetAllClassesService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllClassesServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Class>>> {
        this._logger('info', 'GetAll - GetAllClassesService');
        this._dungeonsAndDragonsRepository.setEntity('Classes');

        const classesInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Class>>;
        return classesInDb;
    }
}
