import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { UpdateCharacterMoneyPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

const UNIT_MAP: Record<string, string> = {
    PC: 'cp',
    PP: 'pp',
    PE: 'ep',
    PO: 'gp',
    PL: 'sp',
};

export default class UpdateCharacterMoneyService {
    private readonly charactersRepository;
    private readonly logger;

    constructor({ charactersRepository, logger }: CharacterCoreDependencies['updateCharacterServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.logger = logger;
        this.update = this.update.bind(this);
    }

    async update({ characterId, operation, money, moneyType }: UpdateCharacterMoneyPayload): Promise<CharactersDnd> {
        this.logger('info', 'UpdateCharacterMoneyService - Update');
        const characterInDb = await this.charactersRepository.findOne({ characterId });
        const unitKey = UNIT_MAP[moneyType];
        if (!unitKey) HttpRequestErrors.throwError('query-string-incorrect');
        const current = (characterInDb.data.money as any)[unitKey] ?? 0;
        let updated = current;
        if (operation === 'add') updated += money;
        else if (operation === 'subtract') updated -= money;
        if (updated < 0) updated = 0;
        (characterInDb.data.money as any)[unitKey] = updated;
        return this.charactersRepository.update({
            query: { characterId },
            payload: characterInDb as CharactersDnd,
        });
    }
}
