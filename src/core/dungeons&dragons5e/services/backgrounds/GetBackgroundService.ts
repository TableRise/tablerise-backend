import { Background } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetBackgroundServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/backgrounds/GetBackground';

export default class GetBackgroundService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetBackgroundServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Background>> {
        this._logger('info', 'GetAll - GetBackgroundService');
        this._dungeonsAndDragonsRepository.setEntity('Backgrounds');

        const backgroundInDb = (await this._dungeonsAndDragonsRepository.findOne({
            backgroundId: id,
        })) as Internacional<Background>;
        return backgroundInDb;
    }
}
