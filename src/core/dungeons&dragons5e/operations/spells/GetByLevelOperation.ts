import { Spell } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import GetByLevelSpellsService from 'src/core/dungeons&dragons5e/services/spells/GetByLevelSpellsService';
import { Logger } from 'src/types/shared/logger';

interface GetByLevelSpellsOperationContract {
    getByLevelSpellsService: GetByLevelSpellsService;
    logger: Logger;
}

export default class GetByLevelOperation {
    private readonly getByLevelSpellsService;
    private readonly logger;

    constructor({ getByLevelSpellsService, logger }: GetByLevelSpellsOperationContract) {
        this.getByLevelSpellsService = getByLevelSpellsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(queryLevel: number): Promise<Array<Internacional<Spell>>> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const spells = await this.getByLevelSpellsService.getByLevel(queryLevel);

        return spells;
    }
}
