import { Background } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledBackgroundsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/GetDisabledBackgrounds';

export default class GetDisabledBackgroundsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledBackgroundsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Background>>> {
        const callName = `[${this.constructor.name}] - ${this.getAllDisabled.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Backgrounds');

        const backgroundInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Background>>;
        return backgroundInDb;
    }
}
