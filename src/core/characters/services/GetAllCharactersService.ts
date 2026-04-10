import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class GetAllCharactersService {
    private readonly charactersRepository;
    private readonly logger;

    constructor({ charactersRepository, logger }: CharacterCoreDependencies['getAllCharactersServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.logger = logger;
    }

    async getAll(): Promise<CharactersDnd[]> {
        this.logger('info', 'GetAll - GetAllCharactersService');
        return this.charactersRepository.find({});
    }
}
