import { Background } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllBackgroundsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/GetAllBackgrounds';

export default class GetAllBackgroundsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllBackgroundsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Background>>> {
        const callName = `[${this.constructor.name}] - ${this.getAll.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Backgrounds');

        const backgroundsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Background>>;

        return backgroundsInDb;
    }
}
