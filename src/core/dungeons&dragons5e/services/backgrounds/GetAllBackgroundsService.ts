import { Background } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetAllArmorsServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/armors/GetAllArmors';

export default class GetAllBackgroundsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllArmorsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;
    }

    public async getAll(): Promise<Array<Internacional<Background>>> {
        this._logger('info', 'GetAll - GetAllBackgroundsService');
        this._dungeonsAndDragonsRepository.setEntity('Backgrounds');

        const backgrounds = await this._dungeonsAndDragonsRepository.find({}) as Array<
            Internacional<Background>
        >;

        return backgrounds;
    }
}