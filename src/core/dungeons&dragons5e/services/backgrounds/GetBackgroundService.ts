import { Background } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetBackgroundServiceContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/GetBackground';

export default class GetBackgroundService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetBackgroundServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Background>> {
        const callName = `[${this.constructor.name}] - ${this.get.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Backgrounds');

        const backgroundInDb = (await this.dungeonsAndDragonsRepository.findOne({
            backgroundId: id,
        })) as Internacional<Background>;
        return backgroundInDb;
    }
}
